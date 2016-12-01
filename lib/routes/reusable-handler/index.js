'use strict';

const Boom = require('boom');
const WL2Boom = require('waterline-to-boom');

const internals = {};

module.exports = {

    getItem: (identity) => {

        return (request, reply) => {

            const Collection = request.collections()[identity];
            const limit = request.query.limit;

            Collection.find({ limit }, (error, foundItem) => {

                if (error){
                    return reply(WL2Boom(error));
                }

                if (!foundItem){
                    return reply(Boom.notFound(`${identity} not found`));
                }
                return reply(foundItem);
            });
        };
    },
    getItemWithId: (identity) => {

        return (request, reply) => {

            const Collection = request.collections()[identity];
            const id = request.params.id;

            Collection.findOne({ id }, (error, foundItem) => {

                if (error){
                    return reply(WL2Boom(error));
                }

                if (!foundItem){
                    return reply(Boom.notFound(`${identity} not found`));
                }
                return reply(foundItem);
            });
        };
    },
    getItemWithAssociatedById: (identity, association) => {

        return (request, reply) => {

            const Collection = request.collections()[identity];
            const id = request.params.id;

            Collection.findOne({ id }).populate(association).exec((error, foundItem) => {

                if (error){
                    return reply(WL2Boom(error));
                }

                if (!foundItem){
                    return reply(Boom.notFound(`${identity} not found`));
                }
                return reply(foundItem);
            });
        };
    },
    deleteItem: (identity) => {

        return (request, reply) => {

            const Collection = request.collections()[identity];
            const id = request.params.id;

            Collection.findOne({ id }, (error, foundItem) => {

                if (error){
                    return reply(WL2Boom(error));
                }
                if (!foundItem){
                    return reply(Boom.notFound(`${identity} not found`));
                }
                Collection.destroy({ id }, (err) => {

                    if (err) {
                        return reply(W2LB(err));
                    }
                    return reply().code(204);
                });
            });
        };
    },
    dropCache: (identity) => {

        return (request, reply) => {

            const id = request.params.id;
            request.server.methods[identity].cache.drop(id, (error, result) => {

                if (error) {
                    return reply(Boom.wrap(error));
                }
                return reply(null, result);
            });
        };
    }
};
