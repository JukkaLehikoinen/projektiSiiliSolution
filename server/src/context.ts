import models, { ModelType } from './models';
import { PubSub } from 'graphql-subscriptions';

export interface MyContext {
    models: ModelType;
    pubsub: PubSub;
}

const pubsub = new PubSub();

export const createContext = (): MyContext => {
    return ({
        models,
        pubsub,
    });
};
