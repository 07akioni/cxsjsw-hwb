const floyd = require('./floyd')

async function main () {
  try {
    const getRoute = await floyd()
    console.log(getRoute(0, 1))
  } catch (err) {
    console.log(err)
  }
}

main()