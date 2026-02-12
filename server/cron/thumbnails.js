const CronJob = require('cron').CronJob,
    axios = require('axios'),
    helpers = require('../helpers/helpers'),
    config = require('../config/default'),
    port = config.rtmp_server.http.port;

const job = new CronJob('*/5 * * * * *', function () {
    axios.get('http://127.0.0.1:' + port + '/api/streams')
        .then(response => {
            let streams = response.data;
            if (typeof (streams['live'] !== undefined)) {
                let live_streams = streams['live'];
                for (let stream in live_streams) {
                    if (!live_streams.hasOwnProperty(stream)) continue;
                    helpers.generateStreamThumbnail(stream);
                }
            }
        })
        .catch(error => {
            // Silently ignore errors when media server API is not ready or no streams available
            if (error.response && error.response.status !== 404) {
                console.log('Error fetching streams:', error.message);
            }
        });
}, null, true);

module.exports = job;