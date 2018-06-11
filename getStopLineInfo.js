const request = require('superagent')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')
require('superagent-charset')(request)

/*
 * 获取路线信息
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

/*
 * 获得线路站点信息
 */
getDistanceInfo()
  .then(diss => {
    diss = diss.map(v => v.trim())
    let currentLine = null
    let lineInfo = {}
    for (let i = 0; i < diss.length; ++i) {
      let matchResult = /(.*)(相邻站间)(.*)$/.exec(diss[i])
      if (matchResult) {
        currentLine = matchResult[1] == '14号线(西段)' ? '14号线（西段）' : matchResult[1]
        lineInfo[currentLine] = []
      } else {
        if (/——/.test(diss[i])) {
          let from = diss[i].split('\n')[0].split('——')[0]
          let to = diss[i].split('\n')[0].split('——')[1]
          lineInfo[currentLine].push(from, to)
        }
      }
    }
    for (let line of Object.keys(lineInfo)) {
      lineInfo[line] = Array.from(new Set(lineInfo[line]))
    }
    fs.writeFileSync('stopLineInfo.json', JSON.stringify(lineInfo))
  })