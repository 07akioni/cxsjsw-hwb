const { models, syncDb } = require('./model')
const { readDistanceInfo } = require('./getDistance')
const stopLineInfo = require('./stopLineInfo')

const {
  Distance,
  Stop
} = models

// console.log(stopLineInfo)

const stop2line = new Map()

for (let line of Object.keys(stopLineInfo)) {
  for (let stop of stopLineInfo[line]) {
    if (stop2line.has(stop)) {
      stop2line.set(stop, stop2line.get(stop) + `，${line}`)
    } else {
      stop2line.set(stop, line)
    }
  }
}

const distanceInfo = readDistanceInfo()
const disMatrix = distanceInfo.disMatrix
const id2placeArray = distanceInfo.id2placeArray

/*
 * 把下载的信息全都写入数据库，毕竟作业要求了
 */
async function insertData () {
  await syncDb()

  for (let v of id2placeArray) {
    await Stop
      .findOrCreate({
        where: {
          id: v.id + 1
        },
        defaults: {
          id: v.id + 1,
          name: v.place,
          line: stop2line.get(v.place)
        }
      })
  }

  for (let i = 0; i < disMatrix.length; ++i) {
    for (let j = 0; j < disMatrix[i].length; ++j) {
      if (disMatrix[i][j] < 100000007) {
        await Distance
          .findOrCreate({
            where: {
              from: i,
              to: j
            },
            defaults: {
              from: i,
              to: j,
              distance: disMatrix[i][j]
            }
          })
      }
    }
  }
}

insertData()