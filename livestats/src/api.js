const axios = require('axios');
const https = require('https');
const fs = require('fs')

class RiotLiveClientDataApi {

  constructor(){
    this.playerNameTeamMap = {};
  }

    init() {
        setInterval(() => {
            this.updateAllGameData();
        },500);
    }

    updateAllGameData() {
        axios({
            url:'https://127.0.0.1:2999/liveclientdata/allgamedata',
            method:'GET',
            timeout: 3000,
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        }).then((response) => {
            let liveData = response.data;
            liveData.scoreStats  = this.getScoreStats(liveData);
            fs.writeFile('./data/blueKills.txt', liveData.scoreStats.blue.kills.toString(), (err) => {
              if(err){
                  console.log(liveData.scoreStats.blue.kills)
                  throw err;
              }
            });
            fs.writeFile('./data/blueTowers.txt', liveData.scoreStats.blue.towers.toString(), (err) => {
                if(err){
                    console.log(liveData.scoreStats.blue.towers)
                    throw err;
                }
            });
            fs.writeFile('./data/redKills.txt', liveData.scoreStats.red.kills.toString(), (err) => {
                if(err){
                    console.log(liveData.scoreStats.red.kills)
                    throw err;
                }
            });
            fs.writeFile('./data/redTowers.txt', liveData.scoreStats.red.towers.toString(), (err) => {
                if(err){
                    console.log(liveData.scoreStats.red.towers)
                    throw err;
                }
            });
            fs.writeFile('./data/gameTime.txt', liveData.scoreStats.game_time.toString(), (err) => {
                if(err){
                    console.log(liveData.scoreStats.game_time)
                    throw err;
                }
            });
            console.log('done')

        }).catch((err) => {
            console.log('error');
        });
    }


    sToHs(s) {
        var h;
        h  =   Math.floor(s/60);
        s  =   Math.floor(s%60);
        h    +=    '';
        s    +=    '';
        h  =   (h.length==1)?'0'+h:h;
        s  =   (s.length==1)?'0'+s:s;
        return h+':'+s;
    }


    getFAKEScoreStats(data) {
        let res = {
            blue: {kills:0, towers:0, gold:'X'},
            red: {kills:0, towers:0, gold:'X'},
            game_time: 0
        };
        return res;
    }



    getScoreStats(data) {
        let res = {
            blue: {kills:0, towers:0, gold:'X'},
            red: {kills:0, towers:0, gold:'X'},
            game_time: 0
        };

        if(!data || !data.allPlayers.length || data.allPlayers.length <= 0) {
            return res;
        }
        data.allPlayers.map((v) => {
            if(v.team == "ORDER") {
                res.blue.kills += v.scores.kills;
            } else {
                res.red.kills += v.scores.kills;
            }
        });
        data.events.Events.map((v) => {
            if(v.EventTime <= data.gameData.gameTime) {
                if(v.EventName == "TurretKilled") {
                    const killedInfo = v.TurretKilled.split('_');
                    if(killedInfo[1] == "T1") {
                        res.red.towers += 1;
                    } else {
                        res.blue.towers += 1;
                    }
                }
            }
        });
        res.game_time = this.sToHs(data.gameData.gameTime);
        return res;
    }
}

module.exports = RiotLiveClientDataApi;
