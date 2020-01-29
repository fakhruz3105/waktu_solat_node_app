const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

//Homepage
router.get('/', (req, res) => res.render('home'));

router.post('/api', async (req, res) => {
    //Fetch zone data
    const zones = await fetch('https://api.azanpro.com/zone/zones.json');
    const json_zones = await zones.json();
    let zone_data = json_zones.results;
    let zone_waktu = [];
    for(let i = 0; i < zone_data.length; i++) {
        zone_waktu.push({
            zone: zone_data[i].zone,
            lat: parseFloat(zone_data[i].lat),
            lon: parseFloat(zone_data[i].lng)
        });
    }
    // console.log(zones_code);
    //Data received from front-end (user's location(lat, lon))
    const data = req.body;
    let nearestDist = Number.MAX_VALUE;
    let nearestZone = 0;
    function getDist(lat, lon) {
        x = Math.abs(data.lat - lat);
        y = Math.abs(data.lon - lon);
        return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    }
    //Finding the nearest zone to user location
    zone_waktu.forEach((zone, i) => {
        let dist = getDist(zone.lat, zone.lon);
        if (dist < nearestDist) {
            nearestDist = dist;
            nearestZone = i;
        }
    });

    // console.log(zone_waktu[nearestZone].zone);

    const api_url = `http://api.azanpro.com/times/today.json?zone=${zone_waktu[nearestZone].zone}&format=24-hour`;
    const res_waktu = await fetch(api_url);
    const json_waktu = await res_waktu.json();


    res.json(json_waktu);
});

module.exports = router;