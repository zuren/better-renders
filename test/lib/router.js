const router = require('../../app/lib/router')

describe('Router', function () {
  describe('adding a route to the router', function () {
    it('should add a handler to that route', function () {
      const routes = router().add('/test-route', () => {})
      const match = routes.match('/test-route')

      expect(match.node.handler).to.be.a('function')
    })
  })

  describe('calling a route on the router', function () {
    describe('when the route handler is a function', function () {
      it('should wait for the route to be complete before responding', async function () {
        const routes = router()
        routes.add('/test-route', function () {
          return 'finished'
        })

        const response = await routes.call('/test-route')
        expect(response).to.eq('finished')
      })
    })

    describe('when the route handler is a generator', function () {
      it('should wait for the route to be complete before responding', async function () {
        const routes = router()
        routes.add('/test-route', function* () {
          yield Promise.resolve('ignore')
          return 'finished'
        })

        const response = await routes.call('/test-route')
        expect(response).to.eq('finished')
      })
    })

    describe('when the route handler is an async function', function () {
      it('should wait for the route to be complete before responding', async function () {
        const routes = router()
        routes.add('/test-route', async function () {
          await Promise.resolve('ignore')
          return 'finished'
        })

        const response = await routes.call('/test-route')
        expect(response).to.eq('finished')
      })
    })
  })
})
