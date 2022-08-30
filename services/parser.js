function removeUnneededText(text) {
    console.log('BING')
    const elkRegex = /E[A-Z]\d\d\d[A-Z]\d[A-Z]/;

    let i = 0;
    let huntJson = {};
    let currentHuntCode = '';
    
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

function breakdownDrawNumbers(preDraw, postDraw) {
    const preDrawLen = preDraw.length - 1;
    const postDrawLen = postDraw.length - 1;
    let currentPreferencePoint = 0;
    let postDrawPreferencePoint = 0;
    let preDrawStats = {};
    let postDrawStats = {};
    
    // get preDrawLogic
    for (let i = preDrawLen; i >= 0; i--) {
        let currentStr = preDraw[i].replace(/\s/g, '');
        let preferencePoint = 0;
        let drawStr = '';

        console.log('current draw code', currentStr)
        console.log(preDrawLen, i)
        if (2 >= (preDrawLen - i)) {
            // gets first two indexs 0/1/2
            preferencePoint = currentStr.charAt(0);
            drawStr = currentStr.slice(1, currentStr.length - 1);
        // } else if ((preDrawLen - i) < 10 && currentStr.charAt(0) !== 1) {
        } else if ((preDrawLen - i) < 10 && (currentStr.charAt(0) !== 1 && currentStr.charAt(0) !== 2)) {
            // basically gets everything up to the 10 index
            preferencePoint = currentStr.charAt(0);
            drawStr = currentStr.slice(1, currentStr.length - 1);
        } else {
            console.log('bang')
            preferencePoint = currentStr.slice(0, 2);
            drawStr = currentStr.slice(2, currentStr.length - 1);
            // double digit codes 
        }
        console.log(preferencePoint, drawStr)
        // console.log(firstChoiceObj)
        preDrawStats[preferencePoint] = drawStr;
    }
    console.log(preDrawStats);
    // get postDraw Logic
    // let res = 
    // structure is [key]
    // let nonRes = 
    // return {res, nonRes}
}

function getResNonResNumbers(pointNumbers) {
    // if length of draw numbers is 6 then we are good
    // if it's greater then 6 more complex
    let res = 0;
    let nonRes = 0;
    if (pointNumbers.length === 6) {
        res = pointNumbers.charAt(0);
        nonRes = pointNumbers.charAt(1);
    } else {
        
    }

}

function organizeHuntCodes(huntObj) {
    const firstChoice = {};
    const huntObjFinal = {};
    // const firstChoiceLength = huntObj.firstChoice.length;

    for (let key in huntObj) {
        const preDraw = huntObj[key].firstChoice.preDraw;
        const postDraw =  huntObj[key].firstChoice.postDraw;
        let firstChoiceObj = {
            firstChoice: {}
        }

        firstChoiceObj.firstChoice[key] = breakdownDrawNumbers(preDraw, postDraw);
    }
    console.log(huntObjFinal);
}

module.exports = {removeUnneededText};