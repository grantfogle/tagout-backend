const express = require("express");
const fileUpload = require('express-fileupload');
const pdfParse = require('pdf-parse');

const app = express();
const fs = require('fs');

// app.get('/', (req, res) => {
//     res.send('hey grant');
//     getHuntCodePdf();
// });

app.use('/', express.static('public'));
app.use(fileUpload());

app.post('/extract-text', (req, res) => {
    if (!req.files &&  !req.files.pdfFile) {
        req.status(400)
        res.end();
    }

    pdfParse(req.files.pdfFile).then(result => {
        res.send(result.text);
    });
});

// crawl pdf
// figure out code of unit
// get res and non res info
// covert to json
// upload json to google fireba


app.listen(3000)