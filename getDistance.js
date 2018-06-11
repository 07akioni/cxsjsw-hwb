const request = require('superagent')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')
require('superagent-charset')(request)

/*
 * 存到 distanceInfo.json 中
 */
function saveDistanceInfo () {
  return buildDistanceInfo()
    .then(o => {
      fs.writeFileSync(path.resolve(__dirname, 'distanceInfo.json'), JSON.stringify(o))
    })
}

/*
 * 构建距离信息
 */
function buildDistanceInfo () {
  return formatDistanceInfo()
    .then(o => {
      let {
        places,
        diss,
        id2place,
        place2id
      } = o
      const placeSize = places.size
      const maxDis = 100000007
      const disMatrix = []
      for (let i = 0; i < placeSize; ++i) {
        disMatrix[i] = []
        for (let j = 0; j < placeSize; ++j) {
          disMatrix[i][j] = maxDis
        }
        disMatrix[i][i] = 0
      }
      diss.forEach(dis => {
        let fromId = place2id.get(dis[0][0])
        let toId = place2id.get(dis[0][1])

        if (dis[2] === '上行/下行') {
          disMatrix[fromId][toId] = Number(dis[1])
          disMatrix[toId][fromId] = Number(dis[1])
        } else if (dis[3] === '上行') {
          disMatrix[fromId][toId] = Number(dis[1])
        } else {
          disMatrix[toId][fromId] = Number(dis[1])
        }
      })
      let id2placeArray = []
      id2place.forEach((v, k) => {
        id2placeArray.push({
          id: k,
          place: v
        })
      })
      return {
        id2placeArray,
        disMatrix
      }
    })
}

/*
 * 整理距离数据格式
 */
function formatDistanceInfo () {
  return getDistanceInfo()
    .then(diss => {
      diss = diss.filter(v => /——/.test(v))
      diss = diss.map(v => v.split('\n'))
      diss = diss.map(v => v.map(l => l.trim()))
      diss = diss.map(v => v.filter(l => l.length > 0))
      diss = diss.map(v => [v[0].split('——'), v[1], v[2]])
      return diss
    })
    .then(diss => {
      const places = new Set()
      const place2id = new Map()
      const id2place = new Map()
      diss.forEach(v => v[0].forEach(l => places.add(l)))
      Array.from(places).forEach((v, i) => {
        place2id.set(v, i)
        id2place.set(i, v)
      })
      return {
        places,
        diss,
        id2place,
        place2id
      }
    })
}

/*
 * 从网上下载距离信息
 */
function getDistanceInfo () {
  return request
    .get('https://www.bjsubway.com/station/zjgls')
    .charset('gb2312')
    .then(res => {
      return res.text
    })
    .then(page => {
      return cheerio.load(page)
    })
    .then($ => {
      const diss = []
      $('tr').each((index, elem) => {
        diss.push($(elem).text())
      })
      return diss
    })
}

function readDistanceInfo () {
  return require(path.resolve(__dirname, 'distanceInfo.json'))
}

module.exports = {
  saveDistanceInfo,
  readDistanceInfo
}

// saveDistanceInfo()
// console.log(readDistanceInfo())