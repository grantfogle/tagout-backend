const express = require("express");
const fileUpload = require('express-fileupload');
const pdfParse = require('pdf-parse');

const app = express();
const fs = require('fs');
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
    res.send(replacedTexts)
});

function removeUnneededText(text) {
    const elkRegex = /E[A-Z]\d\d\d[A-Z]\d[A-Z]/;

    let i = 0;
    let huntJson = {};
    let currentHuntCode = '';
    // start a while loop to get to pre draw applicants
    // push arr into new object
    // do same with post-draw successful
    // then get total choice 1, 2, 3, 4
    // letter letter specifically

    // from there you can probably figure out some basic mafs
    // use counter to get the count of 
    // if there are a lot of numbers, then chances are that there were more applicants early then later, you can add a flag to check manually

    // use seasons to only check for the seasons and methods you want to look for

    // create an index for the array
    // get it down to predraw and post draw
    // remove 
    while (i < text.length) {
        const trimmedText = text[i].trim();

        if (elkRegex.test(trimmedText) && trimmedText.length === 8) {
            currentHuntCode = trimmedText;
            huntJson[currentHuntCode] = {
                firstChoice: {
                    preDraw: [],
                    postDraw: [],
                },
                totalChoice: []
            }
        }

        if (trimmedText === 'Pre-Draw Applicants') {
            const preDrawStats = [];
            let secondIndex = 1;
            let pointCount = 0;
            while (text[i+secondIndex] && !text[i+secondIndex].includes('Post') && !text[i+secondIndex].includes('Total Choice')) {
                let secondTrimmedText =  text[i+secondIndex].trim();

                if (!isNaN(secondTrimmedText.charAt(0)) && secondTrimmedText.length > 1) {
                    pointCount++;
                    preDrawStats.push(secondTrimmedText);
                }
                secondIndex++;
            }

            i += (secondIndex - 1);
            huntJson[currentHuntCode].firstChoice.preDraw = preDrawStats;
        }

        if (trimmedText === 'Post-Draw Successful') {
            let postDrawStats = [];
            let secondIndex = 1;
            let pointCount = 0;

            while (text[i+secondIndex] && text[i+secondIndex] !== 'Post-Draw') {
                let secondTrimmedText =  text[i+secondIndex].trim();

                if (!isNaN(secondTrimmedText.charAt(0)) && secondTrimmedText.length > 1) {
                    postDrawStats.push(secondTrimmedText);
                    pointCount++;
                }
                secondIndex++;
            }

            i += (secondIndex - 1);
            huntJson[currentHuntCode].firstChoice.postDraw = postDrawStats;
        }

        if (trimmedText.includes('Total Choice')) {
            huntJson[currentHuntCode].totalChoice.push(trimmedText);
        }

        i++;
    }

    organizeHuntCodes(huntJson);

    return huntJson;
}

function breakdownDrawNumbers(drawNumber) {

}

function organizeHuntCodes(huntObj) {
    const firstChoice = {};
    const huntObjFinal = {};
    // const firstChoiceLength = huntObj.firstChoice.length;

    for (let key in huntObj) {
        const preferencePointsLen = huntObj[key].firstChoice.preDraw.length - 1;
        let currentPreferencePoint = 0;
        const huntStr = huntObj[key].firstChoice.preDraw;
        let firstChoiceObj = {}

        for (let i = preferencePointsLen; i >= 0; i--) {
            console.log('i', huntStr[i]);
            let currentStr = huntStr[i].replace(/\s/g, '');
            let preferencePoint = 0;
            let drawStr = '';
            console.log('stinky kaila', currentStr)
            if (2 < (preferencePointsLen - i)) {
                preferencePoint = currentStr.charAt(0);
                drawStr = currentStr.slice(1, currentStr.length - 1)
            } else if ((preferencePointsLen - i) < 10 && currentStr.charAt(0) !== 1) {
                preferencePoint = currentStr.charAt(0);
                drawStr = currentStr.slice(1, currentStr.length - 1)
            } else {
                preferencePoint = currentStr.slice(0, 2);
                drawStr = currentStr.slice(2, currentStr.length - 1)
                // double digit codes 
            }
            firstChoiceObj[preferencePoint] = drawStr;
            // console.log(firstChoiceObj);
        }
        // huntObjFinal[key] = firstChoiceObj;
    }
    console.log(huntObjFinal)
}

app.listen(3002)