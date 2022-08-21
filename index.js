const express = require("express");
const fileUpload = require('express-fileupload');
const pdfParse = require('pdf-parse');

const app = express();
const fs = require('fs');
const { getEnabledCategories } = require("trace_events");
const res = require("express/lib/response");

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
    // use regex to get hunt code,
    const elkRegex = /E[A-Z]\d\d\d[A-Z]\d[A-Z]/;
    // start a while loop to get to pre draw applicants
    // push arr into new object
    // do same with post-draw successful
    // then get total choice 1, 2, 3, 4
    // letter letter specifically

    // from there you can probably figure out some basic mafs
    // use counter to get the count of 
    // if there are a lot of numbers, then chances are that there were more applicants early then later, you can add a flag to check manually

    // use seasons to only check for the seasons and methods you want to look for
    // /E/

    let i = 0;
    let finalArr = [];
    let huntJson = {};
    console.log('cats')
    // create an index for the array
    // get it down to predraw and post draw
    // remove 
    while (i < text.length) {
        const trimmedText = text[i].trim();

        if (elkRegex.test(trimmedText) && trimmedText.length === 8) {
            let counter = 0;
            let firstChoice = [];
            let secondChoice = [];
            let thirdChoice = [];
            // create another while loop which starts counting
            while(!trimmedText[i+counter].includes('Total Choice')) {
                if ()
                
            }
            
            huntJson[trimmedText] = {firstChoice, secondChoice, thirdChoice}
        }

        // CAN MOST LIKELY REMOVE THIS LOGIC
        // if (text[i].length !== 0 &&
        //     !(text[i] === ',') &&
        //     (text[i].length > 1) &&
        //     !text[i].includes('Landowner Leftover') &&
        //     !text[i].includes('UnrestrictedRestricted') &&
        //     !text[i].includes('ChoicePreference Points') &&
        //     !text[i].includes('Res NonRes Res NonRes') &&
        //     !text[i].includes('AdultYouthLandowner (LPP)') &&
        //     !text[i].includes('DrawnHunt CodeList') &&
        //     !text[i].includes('Colorado Parks and Wildlife') &&
        //     !text[i].includes('2021 Primary ELK Post Draw Report') &&
        //     !text[i].includes('5/14/2021') &&
        //     !text[i].includes('Page')) {
                // remaining
                // balance
        //     finalArr.push(text[i]);
        // }
        // if 
        // regex check

        // if (text[i] === 'Pre-Draw Applicants') {
        //     let secondCounter = 0;
            // this gets the total count of 
            // while (!text[i + secondCounter].includes('Total Choice')) {
                // 
            //     secondCounter++;
            // }
            // iterate through array 
            // continuing iterating through until we hit total choice
        // }

        // if (text[i] = 'Post-Draw Successful') {
            // do same logic as pre-draw applicants
            // get 
        // }

        i++;
    }
    // get regex pattern for start of
    // ee, ef, em
    // 

    // finalJson
    // will contain hunt code - ee/ef/eo
    // data object
    // first choice
    // second choice
    // third choice
    return huntJson;
}

function breakUpArrayByDrawCode(elkArr) {

    // scroll through the string/array
    // 'EE001E1R  ', regex to match the elk unit, from there create a while loop
    // you will index the first unit and increase count
    // while 
    elkArr.forEach(unit => {
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