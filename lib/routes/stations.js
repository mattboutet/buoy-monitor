'use strict';

const Joi = require('joi');
const Boom = require('boom');
const internals = {};
const WL2Boom = require('waterline-to-boom');
const FakeToe = require('faketoe');
const Wreck = require('wreck');
const Items = require('items');
const ReuseHandler = require('./reusable-handler');


module.exports = (server, options) => {

    return [
        {
            method: 'GET',
            path: '/stations/upate',
            config: {
                description: 'Fetch new station data from NOAA.  Overwrites existing data',
                tags: ['api'],
                 auth: false //{ //TODO UPDATE THIS - It's expensive, and should be hard/impossible to hit. Also, NOAA would hate me.
                //     strategy: 'api-user-jwt'
                // }
            },
            handler: (request, reply) => {

                const uri = 'http://www.ndbc.noaa.gov/activestations.xml';

                Wreck.get(uri, function (err, res, payload) {

                    if (err){

                        reply(Boom.wrap(err));
                    }
                    var stream = Wreck.toReadableStream(payload, 'utf-8');
                    var parser = FakeToe.createParser(function (error, result) {

                        const Stations = request.collections().stations;
                        Items.parallel(result.stations.station, function(station, next) {

                            Stations.findOrCreate({ id: station.id }, station, (stationErr, newStation) => {

                                if (stationErr) {
                                    next(WL2Boom(stationErr));
                                }
                                next();

                            });

                        },(itemsErr) => {

                            if (itemsErr){
                                return reply(itemsErr);
                            }
                            return reply('Stations updated!');
                        });
                    });
                    parser.on('error', function (error) {

                        console.log(error);
                        reply(Boom.badRequest('Now you done did it.'));
                    });
                    stream.pipe(parser);
                });
            }
        },

        //  - Station CRUD -
        {
            method: 'GET',
            path: '/stations',
            config: {
                description: 'Get all stations',
                tags: ['api'],
                auth: false,
                validate: {
                    query: {
                        limit: Joi.number().integer().min(1).default(10)
                    }
                }
            },
            handler: ReuseHandler.getItem('stations')
        },
        {
            method: 'GET',
            path: '/stations/{id}',
            config: {
                description: 'Get a station',
                tags: ['api'],
                validate: {
                    params: {
                        id: Joi.number().integer().required()
                    }
                },
                auth: false
            },
            handler: ReuseHandler.getItemWithId('stations')
        }//,
        // {
        //     method: 'DELETE',
        //     path: '/stations/{id}',
        //     config: {
        //         description: 'Delete a station',
        //         tags: ['api'],
        //         validate: {
        //             params: {
        //                 id: Joi.number().integer().required()
        //             }
        //         },
        //         auth: {
        //             strategy: 'api-user-jwt'
        //         }
        //     },
        //     handler: ReuseHandler.deleteItem('stations')
        // }
    ];
};
