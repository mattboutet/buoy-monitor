'use strict';

module.exports = (srv, options) => {

    return {
        connection: options.connection,
        autoPK: false,

        attributes: {
            id: {
                type: 'string',
                unique: true,
                primaryKey: true,
                required: true
            },
            name: {
                type: 'string'
            },
            lat: {
                type: 'string',
                protected: true
            },
            lon: {
                type: 'string',
                required: true
            },
            owner: {
                type: 'string',
                required: true
            },
            type: {
                type: 'string'
            },
            met: {
                type: 'string'
            },
            currents: {
                type: 'string'
            },
            waterQuality: {
                type: 'string'
            },
            buoyData: {
                collection: 'buoy-data',
                via: 'station'
            }
        }
    };
};
