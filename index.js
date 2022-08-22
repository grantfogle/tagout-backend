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

        // get second, third, and fourth choices

        // if (trimmedText.includes('Total Choice')) {
        //     console.log(trimmedText);
        // }
        if (trimmedText.includes('Total Choice')) {
            huntJson[currentHuntCode].totalChoice.push(trimmedText);
        }

        i++;
    }

    organizeHuntCodes(huntJson);

    return huntJson;
}

function organizeHuntCodes(huntObj) {
    const firstChoice = {};
    const huntObjFinal = {};
    // const firstChoiceLength = huntObj.firstChoice.length;

    for (let key in huntObj) {
        const preferencePointsLen = huntObj[key].firstChoice.preDraw.length;
        let currentPreferencePoint = 0;

        huntObj[key].firstChoice.preDraw.forEach((unit, index) => {
            let preferencePoint;
            let breakdown = {};

            if (preferencePointsLen > 10 ) {
                // if first 
            }
            console.log(unit)
            // get first index
            //  

        });
        // huntObj[key].firstChoice.forEach(unit => {
        //     console.log(unit);
        // });
    }
}

function breakUpArrayByDrawCode(elkArr) {

    // scroll through the string/array
    // 'EE001E1R  ', regex to match the elk unit, from there create a while loop
    // you will index the first unit and increase count
    // while 
    elkArr.forEach(unit => {
        console.log(unit)
        // if 
        // while
    })
}
// break up array by draw code
// crawl pdf
// figure out code of unit
// get res and non res info
// covert to json
// upload json to google fireba


app.listen(3002)