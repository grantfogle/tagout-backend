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
    // await fs.readFile('./elk.txt', function(text) {
    //     const textByLine = text.split('\n');
    //     console.log(textByLine);
    // })
    var text = fs.readFileSync("./elk.txt", 'utf-8');

    var newlines = text.split('\n');
    var replacedTexts = removeUnneededText(newlines);
    // remove unneeded text
    // break up text by preference point
    // ee0001e1r
    // then get the preference points
    res.send(replacedTexts)
});

function removeUnneededText(text) {
    // use regex to get hunt code,
    // start a while loop to get to pre draw applicants
    // push arr into new object
    // do same with post-draw successful
    // then get total choice 1, 2, 3, 4
    // letter letter specifically
    const species = ['ef, ee, em'];
    // number number number
    const unit = 001;
    // 'letter number'
    const season = ['O1']
    // letter
    const method = ['r', 'a', 'm']
    // /E/

    let i = 0;
    let finalArr = [];
    let huntJson = {};

    // create an index for the array
    // get it down to predraw and post draw
    // remove 
    while (i < text.length) {
        if (text[i].length !== 0 &&
            !(text[i] === ',') &&
            (text[i].length > 1) &&
            !text[i].includes('Landowner Leftover') &&
            !text[i].includes('UnrestrictedRestricted') &&
            !text[i].includes('ChoicePreference Points') &&
            !text[i].includes('Res NonRes Res NonRes') &&
            !text[i].includes('AdultYouthLandowner (LPP)') &&
            !text[i].includes('DrawnHunt CodeList') &&
            !text[i].includes('Colorado Parks and Wildlife') &&
            !text[i].includes('2021 Primary ELK Post Draw Report') &&
            !text[i].includes('5/14/2021') &&
            !text[i].includes('Page')) {
                // remaining
                // balance
            finalArr.push(text[i]);
        }
        // if 
        // regex check
        if (text[i].trim() === 'EE001E1R') {

        }

        if (text[i] === 'Pre-Draw Applicants') {
            let secondCounter = 0;
            // this gets the total count of 
            while (!text[i + secondCounter].includes('Total Choice')) {
                // 
                secondCounter++;
            }
            console.log()
            // iterate through array 
            // continuing iterating through until we hit total choice
        }

        if (text[i] = 'Post-Draw Successful') {
            // do same logic as pre-draw applicants
            // get 
        }

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
    return finalArr;
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