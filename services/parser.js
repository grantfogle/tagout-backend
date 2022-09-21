// runs first
function removeUnneededText(text) {
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

    let data = organizeHuntCodes(huntJson);
    return data;

 
}

function breakdownDrawNumbers(preDraw, postDraw) {
    const preDrawLen = preDraw.length - 1;
    const postDrawLen = postDraw.length - 1;
    let preDrawStats = breakdownDrawStats(preDrawLen, preDraw);
    let postDrawStats = breakdownDrawStats(postDrawLen, postDraw);
    // get applicants stats
    let applicantStats = getResNonResNumbers(preDrawStats);
    // get success stats
    let successStats = getResNonResNumbers(postDrawStats);
    // console.log('PRE DRAW STATS', applicantStats)
    // console.log('POST DRAW STATS', successStats)
    return {applicantStats, successStats};
}

function breakdownDrawStats(arrLength, drawNums) {
    let drawStats = {};
    for (let i = arrLength; i >= 0; i--) {
        let currentStr = drawNums[i].replace(/\s/g, '');
        let preferencePoint = 0;
        let drawStr = '';

        if (2 >= (arrLength - i)) {
            // gets first two indexs 0/1/2
            preferencePoint = currentStr.charAt(0);
            drawStr = currentStr.slice(1, currentStr.length - 1);
        } else if ((arrLength - i) < 10 && (currentStr.charAt(0) !== 1 && currentStr.charAt(0) !== 2)) {
            // basically gets everything up to the 10 index
            preferencePoint = currentStr.charAt(0);
            drawStr = currentStr.slice(1, currentStr.length - 1);
        } else {
            preferencePoint = currentStr.slice(0, 2);
            drawStr = currentStr.slice(2, currentStr.length - 1);
            // double digit codes 
        }
        drawStats[preferencePoint] = drawStr;
    }
    // console.log(drawStats)
    return drawStats; 
}



function getResNonResNumbers(pointNumbers) {
    let returnObj = {};

    for (let key in pointNumbers) {
        const drawNums = pointNumbers[key];
        const totalLength = drawNums.length;
        let res = 0;
        let nonRes = 0;
        if (totalLength <= 6) {
            res = (drawNums.charAt(0) !== '-' ? Number(drawNums.charAt(0)) : 0);
            nonRes = (drawNums.charAt(1) !== '-' ? Number(drawNums.charAt(1)) : 0);
        } else {
            if (totalLength % 2 === 0) {
                let avgUnits = Math.ceil(totalLength / 6) + 1;
            
                let secondIndex =  (avgUnits) * 2;
                res =  Number(drawNums.slice(0, avgUnits));
                nonRes = Number(drawNums.slice((avgUnits), secondIndex));
            } else {
                const avgUnits = Math.ceil(totalLength / 6) + 1;
                res =  Number(drawNums.slice(0, avgUnits));
                if (res > 0 && res < 100) {

                } else if (res ) {

                }

            }
        }
        returnObj[key] = {
            res, nonRes
        }
    }
    // console.log('returnObj', returnObj);
    return returnObj;
}

function organizeHuntCodes(huntObj) {
    // get draw data and put it into a format where i can easily compile into 
    // my final Obj
    const firstChoice = {};
    let huntObjFinal = {};

    // breakdown first choice data
    for (let key in huntObj) {
        const preDraw = huntObj[key].firstChoice.preDraw;
        const postDraw =  huntObj[key].firstChoice.postDraw;
        let firstChoiceObj = {
            firstChoice: breakdownDrawNumbers(preDraw, postDraw)
        }
        // console.log(firstChoiceObj)
        firstChoice[key] = firstChoiceObj;
    }
    // console.log(firstChoice);
    huntObjFinal = formatDrawData(firstChoice);
    return huntObjFinal;
}

function formatDrawData(drawData) {
    let returnObj = {};
    for (let huntCode in drawData) {
            returnObj[huntCode] = {
                firstChoice: getStatsByPreferencePoint(drawData[huntCode].firstChoice.applicantStats, drawData[huntCode].firstChoice.successStats)
            }
    }
    console.log(returnObj)
    return returnObj;
}

function getStatsByPreferencePoint(applicants, success) {
    let returnObj = {};
    for (let preferencePoint in applicants) {
        returnObj[preferencePoint] = {
            res: {
                applicants: applicants[preferencePoint].res,
                success: success[preferencePoint].res
            },
            nonRes: {
                applicants: applicants[preferencePoint].nonRes,
                success: success[preferencePoint].nonRes
            }
        }
    }
    console.log('RETURN OBJ', returnObj)
    return returnObj;
}

module.exports = {removeUnneededText};