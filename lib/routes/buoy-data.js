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
            path: '/buoy-data/upate',
            config: {
                description: 'Fetch hourly data from NOAA.',
                tags: ['api'],
                 auth: false //{ //TODO UPDATE THIS - It's expensive, and should be hard/impossible to hit manually. Also, NOAA would hate me.
                //     strategy: 'api-user-jwt'
                // }
            },
            handler: (request, reply) => {
                const Stations = request.collections().stations;

                Stations.find((error, stations) => {

                    Items.parallel(stations, function(station, next) {

                        const uri = 'http://www.ndbc.noaa.gov/data/realtime2/' + station.id + '.txt';

                        Wreck.get(uri, function (err, res, payload) {

                            if (err){

                                reply(Boom.wrap(err));
                            }
                            //need to parse (hopefully) tab separated data
                            //also build new object before inserting, since the NOAA data
                            //uses shite column names, and dates are extra-fucky. 
                        });
                    },(itemsErr) => {

                        if (itemsErr){
                            return reply(itemsErr);
                        }
                        return reply('All Stations updated!');
                    });
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
