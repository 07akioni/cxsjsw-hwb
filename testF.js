const floyd = require('./floyd')

/*
 * 没什么可写，就是测试一下
 */
async function main () {
  try {
    const getRoute = await floyd()
    console.log(getRoute(0, 1))
  } catch (err) {
    console.log(err)
  }
}

main()