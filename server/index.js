const express = require('express');
const cors = require('cors');
const app = express();
const axios = require('axios');

const brewKey = process.env.BREW_KEY;

app.use(cors({
    origin: /^https:\/\/ncko\.github\.io/
}));

// app.use((req, res, next) => {
//     // Check that the request is coming from ncko.github.io
//     // The same origin policy doesn't cover subdomains
//     const origin = req.header('Origin');
//     if (!origins || !/^https:\/\/ncko\.github\.io/g.test(origin)) {
//         console.error(`Somebody is trying to use your server from ${origin}!`);
//         res.status(401).send('Shame');
//         return;
//     }

//     next();
// });

app.get('/styles', async (req, res) => {
    let styles;
    try {
        styles = await axios.get(`https://sandbox-api.brewerydb.com/v2/styles/?key=${brewKey}`);
        res.status(200).json(styles.data);
    } catch (error) {
        console.error('GET /styles', { error });
        res.status(500).json({ error });
    }
});

app.get('/beers', async (req, res) => {
    let beers;
    const beerStyleId = req.query.styleId;

    try {
        beers = await axios.get(`https://api.brewerydb.com/v2/beers/?key=${brewKey}&styleId=${beerStyleId}`);
        res.status(200).json(beers.data)
    } catch (error) {
        console.error('GET /beers', { error });
    }
});

app.listen(80, () => {
    console.log('Listening on port 80');
});

