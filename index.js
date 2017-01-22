var _ = require("lodash");

function formatSurveyData(responses, choices){
    var formattedResponses = sheetsToArray(responses);
    var responsesByDate = groupResponsesByDate(formattedResponses, choices);

    return incrementResponsesCount(responsesByDate, formattedResponses);
}

function sheetsToArray(sheetsData){
    return sheetsData.valueRanges[0].values[0].map(function(date, index){
        return {
            date,
            value: sheetsData.valueRanges[1].values[0][index]
        };
    });
}

function getUniqueDates(responses){
    return new Set(responses.map(response => dateToMMDDYYYY(new Date(response.date))));
}

function groupResponsesByDate(responses, choices){
    var responsesByDate = [];
    getUniqueDates(responses).forEach(function(date){
        var dateRecord = {date};
        dateRecord.values = choices.map(option => {return {label: option, value: 0}});
        dateRecord.responseCount = 0;
        dateRecord.responseAverage = null;
        responsesByDate.push(dateRecord);
    });

    return responsesByDate;
}

function incrementResponsesCount(responseAccumulator, responses){
    responses.forEach(function(response){
        incrementResponseCount(responseAccumulator, response.date, response.value);
    });

    return responseAccumulator;
}

function incrementResponseCount(responseAccumulator, date, score){
    var matchingDate = _.find(responseAccumulator, {date: dateToMMDDYYYY(new Date(date))});
    var matchingScore = _.find(matchingDate.values, {label: score});
    matchingDate.responseCount++;
    matchingScore.value++;
    matchingDate = updateResponseAverage(matchingDate);
}

function updateResponseAverage(dateRecord){
    var responseValue = 0;
    var weightedScore = dateRecord.values.reduce(function(previous, current){
        responseValue++;
        return previous + (current.value * responseValue);
    }, 0);
    dateRecord.responseAverage = (weightedScore / dateRecord.responseCount * responseValue) / responseValue;

    return dateRecord;
}

// Utilities
function dateToMMDDYYYY(date){
    return [(date.getMonth() + 1), date.getDate(), date.getFullYear()].join("/");
}

function getOneDay(startDate){
    var oneDay = new Date(startDate.getTime());
    oneDay.setDate(oneDay.getDate() + 1);

    return oneDay;
}

module.exports = formatSurveyData;
