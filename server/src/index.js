const express = require('express')

const app = express()
const bodyParser = require('body-parser')
const { ApolloServer } = require('apollo-server-express')
const http = require('http')
const { makeExecutableSchema } = require('graphql-tools')
const { execute, subscribe } = require('graphql')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const config = require('./utils/config')
const typeDefs = require('./graphql/typedefs')
const resolvers = require('./graphql/resolvers')

const schema = makeExecutableSchema({ typeDefs, resolvers })
app.use('/graphql', bodyParser.json())
app.use('/health', require('express-healthcheck')())
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET, POST'],
    allowedHeaders: ['Content-Type', 'Accept', 'User-Agent', 'Referer'],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const apollo = new ApolloServer({
    schema,
    cor: corsOptions,
    playground: true,
    introspection: true,
    formatError: (err) => {
        console.log("formatError")
        console.log(err)
        // Don't give the specific errors to the client.
        if (err.message.startsWith("Database Error: ")) {
            return new Error('Internal server error');
        }
        // Otherwise return the original error.  The error can also
        // be manipulated in other ways, so long as it's returned.
        return err;
    },
})
apollo.applyMiddleware({ app, path: '/graphql' })

const server = http.createServer(app)
apollo.installSubscriptionHandlers(app)

server.listen({ port: config.PORT }, () => {
    console.log(`Server running on port ${config.PORT}`)
    // eslint-disable-next-line no-new
     new SubscriptionServer({
        execute,
        subscribe,
        schema,
    }, {
        server,
        path: '/graphql',
    })
})


const closeHttpServer = () => {
    server.close()
}

module.exports = { app, closeHttpServer }
