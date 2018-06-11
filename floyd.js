const { readDistanceInfo } = require('./getDistance')
const { models } = require('./model')

module.exports = async function () {
  try {
    const { Stop, Distance } = models

    /*
     * 从数据库获得距离和站的信息
     */
    let distanceModels = await Distance.findAll()
    let StopModels = await Stop.findAll()

    /*
     * 接下来构建距离矩阵
     */
    // const distanceInfo = readDistanceInfo()
    const disMatrix = []
    // const id2placeArray = distanceInfo.id2placeArray

    const id2place = new Map()
    const id2line = new Map()
    // console.log(StopModels)
    StopModels.forEach(v => {
      // console.log(v.dataValues)
      id2place.set(v.id - 1, v.name)
      id2line.set(v.id - 1, v.line)
    })

    // console.log(id2place.size)

    for (let i = 0; i < id2place.size; ++i) {
      disMatrix[i] = []
      for (let j = 0; j < id2place.size; ++j) {
        disMatrix[i][j] = 100000007
      }
      disMatrix[i][i] = 0
    }

    distanceModels.forEach(v => {
      // console.log(v.from, v.to)
      // console.log(disMatrix[v.from])
      disMatrix[v.from][v.to] = v.distance
    })

    function getEmptyRouteMatrix (size, disMatrix) {
      const Matrix = []
      for (let i = 0; i < size; ++i) {
        Matrix[i] = []
        for (let j = 0; j < size; ++j) {
          if (disMatrix[i][j] < 100000007) {
            Matrix[i][j] = i
          } else {
            Matrix[i][j] = null
          }
        }
        Matrix[i][i] = i
      }
      return Matrix
    }

    const routeMatrix = getEmptyRouteMatrix(id2place.size, disMatrix)

    /*
     * floyd 算法主体
     */
    function floyd() {
      for (let k = 0; k < id2place.size; ++k) {
        for (let i = 0; i < id2place.size; ++i) {
          for (let j = 0; j < id2place.size; ++j) {
            let newDis = disMatrix[i][k] + disMatrix[k][j]
            if (newDis < disMatrix[i][j]) {
              disMatrix[i][j] = newDis
              routeMatrix[i][j] = routeMatrix[k][j]
            }
          }
        }
      }
    }

    floyd()

    /*
     * 返回一个运行了之后根据起点终点 id 能获得最短距离、可达信息、具体路径的函数
     */
    return function getRoute (fromId, toId) {
      const minDistance = disMatrix[fromId][toId]
      const reachable = minDistance < 100000007 ? true : false
      if (!reachable) {
        return {
          reachable,
          minDistance,
          route: []
        }
      }
      let route = []
      route.push(toId)
      while (true) {
        if (routeMatrix[fromId][toId] === fromId) {
          route.push(fromId)
          break
        } else {
          toId = routeMatrix[fromId][toId]
          route.push(toId)
        }
      }
      route = route.reverse()
      route = route.map(id => [id2place.get(id), id2line.get(id)])
      return {
        reachable,
        minDistance,
        route
      }
    }
  } catch (err) {
    console.log(err)
  }
}