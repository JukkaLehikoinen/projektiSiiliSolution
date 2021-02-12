import {expressApp} from "./express";
import { ApolloServer } from 'apollo-server-express';
import * as http from "http";
const { makeExecutableSchema } = require('graphql-tools')

const config = require('./utils/config')
const typeDefs = require('./graphql/typedefs')
const resolvers = require('./graphql/resolvers')
import { applyMiddleware } from 'graphql-middleware';
import express from 'express';
import {createContext} from "./context";

const env = process.env.NODE_ENV

const schema = applyMiddleware(
    makeExecutableSchema({
        typeDefs,
        resolvers: resolvers,
    }),
);

// const corsOptions = {
//     origin: frontendUrl,
//     methods: ['GET, POST'],
//     allowedHeaders: ['Content-Type', 'Accept', 'User-Agent', 'Referer'],
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// };
/*
const app = expressApp()

const apollo = new ApolloServer({
    schema,
    cor: corsOptions,
    playground: true,
    introspection: true,
    formatError: (err: GraphQLError) => {
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
})*/

const createApolloServer = (): ApolloServer => new ApolloServer({
    schema,
    context: createContext,
    introspection: process.env.NODE_ENV !== 'production',
    playground: process.env.NODE_ENV !== 'production',
    subscriptions: {
        onConnect: (): void => {
            process.stdout.write('Connected to websocket\n');
        },
    },
});


const initializeApolloServer = (apollo: ApolloServer, app: express.Application) => {
    apollo.applyMiddleware({ app });

    return (): void => {
        process.stdout.write(
            `🚀 Server ready at http://localhost:${config.PORT}${apollo.graphqlPath}\n`,
        );
    };
};

export const startServer = async (app: express.Application) => {
    const httpServer = http.createServer(app)

    const apollo = createApolloServer();
    apollo.installSubscriptionHandlers(httpServer);
    const handleApolloServerInitialized = initializeApolloServer(apollo, app);

    return httpServer.listen({ port: config.PORT }, () => {
        handleApolloServerInitialized()
        console.log(process.memoryUsage());

    })
}

if (env !== 'test') {
    const app = expressApp()
    startServer(app)
}


// apollo.applyMiddleware({ app: app })
//
// apollo.installSubscriptionHandlers(app)
//
// app.listen({ port: config.PORT }, () => {
//     console.log(`Server running on port ${config.PORT}/${apollo.graphqlPath}`)
//     new SubscriptionServer({
//         execute,
//         subscribe,
//         schema,
//     }, {
//         server,
//         path: '/graphql',
//     })
// })
//
// server.close()

