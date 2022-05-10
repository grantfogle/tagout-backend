const express = require("express");
const fileUpload = require('express-fileupload');
const pdfParse = require('pdf-parse');

const app = express();
const fs = require('fs');
const { getEnabledCategories } = require("trace_events");

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

app.get('/convert-to-json', async () => {
    console.log('cats');
    // await fs.readFile('./elk.txt', function(text) {
    //     const textByLine = text.split('\n');
    //     console.log(textByLine);
    // })
    var text = fs.readFileSync("./elk.txt", 'utf-8');

    var newlines = text.split('\n');
    var replacedTexts = removeUnneededText(newlines.join(''));

    console.log(replacedTexts);
    // remove unneeded text
    // break up text by preference point
    // ee0001e1r
    // then get the preference points
});

function removeUnneededText(text) {
    // 

    // Post-DrawSuccessful# DrawnBalanceRes NonRes ResNonResUnrestrictedRestricted
    let finalText = text;
    let elimateTextCodes = [
        'Post-DrawSuccessful',
        'DrawnBalance',
        'Res',
        'NonRes',
        'DrawnHunt',
        'Post-Draw Successful',
        'AdultYouthLandowner (LPP)',
        'ChoicePreference Points',
        'UnrestrictedRestricted',
        'Colorado Parks and Wildlife'
    ];
    elimateTextCodes.forEach((eliminateText, i) => {
        finalText = finalText.replace(eliminateText, '');
    });
    return finalText;
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


app.listen(3000)