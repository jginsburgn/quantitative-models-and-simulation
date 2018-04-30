const express = require('express');
const app = express();
const crawler = require('./crawler.js');
const bodyParser = require('body-parser');

app.post('/', bodyParser.urlencoded({ extended: false }), (req, res) => {
    try {
        var response = {
            code: "success",
            path: crawler(req.body.vertexID.toString())
        }
        res.send(response);
    }
    catch (e) {
        res.send({ code: "failure" });
    }
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));