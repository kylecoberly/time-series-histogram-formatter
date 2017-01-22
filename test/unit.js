var assert = require("assert");
var formatter =  require("../index");

var rawData = {
    spreadsheetId: "11LECozvVpx5A7Ux5_8Zf_wdTD1hfXRclZpJ-xhVeJRs",
    valueRanges: [{
        range: "'Form Responses 1'!A2:A5",
        majorDimension: "COLUMNS",
        values: [[
            "12/6/2016 15:57:58",
            "12/6/2016 16:03:18",
            "12/6/2016 16:05:59",
            "12/6/2016 16:30:35"
        ]]
    },{
        range: "'Form Responses 1'!C2:C5",
        majorDimension: "COLUMNS",
        values: [[
            "Looking forward to it",
            "Looking forward to it",
            "Looking forward to it",
            "Extremely - can't wait!"
        ]]
    }]
};
var choices = ["I'm toasty", "Getting tired", "Looking forward to it", "Extremely - can't wait!"];

describe("Module", function(){
    describe("#formatSurveyData()", function(){
        it("should format data correctly", function(){
            var expected = [{
                date: '12/6/2016',
                values: [{
                    label: 'I\'m toasty',
                    value: 0
                },{
                    label: 'Getting tired',
                    value: 0
                },{
                    label: 'Looking forward to it',
                    value: 3
                },{
                    label: 'Extremely - can\'t wait!',
                    value: 1
                }],
                responseCount: 4,
                responseAverage: 3.25
            }];
            var actual = formatter(rawData, choices);
            assert.deepEqual(expected, formatter(rawData, choices));
        });
    });
});
