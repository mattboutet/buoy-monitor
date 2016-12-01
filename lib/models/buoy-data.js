'use strict';

module.exports = (srv, options) => {

    return {
        connection: options.connection,

        attributes: {
            station: {
                model: 'stations'
            },
            observationTime: {
                type: 'datetime',
                required: true,
            },
            windDirection: {
                type: 'integer',
                required: true
            },
            windSpeed: {
                type: 'float',
                required: true
            },
            windGust: {
                type: 'float',
                required: true
            },
            waveHeight: {
                type: 'float',
                required: true
            },
            dominantPeriod: {
                type: 'float',
                required: true
            },
            averagePeriod: {
                type: 'float',
                required: true
            },
            dominantSwellDirection: {
                type: 'integer',
                required: true
            },
            pressure: {
                type: 'float',
                required: true
            },
            airTemp: {
                type: 'float',
                required: true
            },
            waterTemp: {
                type: 'float',
                required: true
            },
            dewPoint: {
                type: 'float'
            }
        }
    };
};
