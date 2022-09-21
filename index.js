const express = require("express");
const fileUpload = require('express-fileupload');
const pdfParse = require('pdf-parse');

const app = express();
const fs = require('fs');
const {removeUnneededText} = require('./services/parser');
const { getEnabledCategories } = require("trace_events");
const res = require("express/lib/response");
const { emitKeypressEvents } = require("readline");

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

app.get('/convert-to-json', async (req, res) => {
    var text = fs.readFileSync("./elk.txt", 'utf-8');

    var newlines = text.split('\n');
    var replacedTexts = removeUnneededText(newlines);

    // var replactText = fs.writeFile("/tmp/elkStats.json", replacedTexts, function(err) {
    //     if (err) {
    //         return console.log(err);
    //     }
    //     console.log("The file was saved!");
    // }); 

    res.send(replacedTexts);
});

app.listen(3002)