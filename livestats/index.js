const RiotLiveClient = require('./src/api.js');
const riotLiveClient = new RiotLiveClient();

riotLiveClient.init();
console.log('Running Live Stats');
