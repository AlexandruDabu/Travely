const authRouter = require('./authRouter');
const travelsRouter = require('./travelsRouter')
const followerRouter = require('./followersRouter')
const messagesRouter = require('./messagesRouter')
const mountRoutes = (app) => {
    app.use('/auth',authRouter)
    app.use('/', travelsRouter)
    app.use('/', followerRouter)
    app.use('/', messagesRouter)
}
module.exports = mountRoutes;
