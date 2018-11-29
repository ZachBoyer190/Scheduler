let scheduleID = "12345";
let scheduleEditCode = "12345";
const errorCode = 300;
const requestURL = 'https://jkp5zoujqi.execute-api.us-east-2.amazonaws.com/Alpha/createschedule';
let redirectURL = "viewSchedule.html"


function validateDaysOfWeek(){

    let startDateValue = new Date(document.createCalendar.startingDate.value);
    let endingDateValue = new Date(document.createCalendar.endingDate.value);

    let startingTime = parseInt(document.createCalendar.startingTime.value);
    let endingTime = parseInt(document.createCalendar.endingTime.value);


    if (startDateValue > endingDateValue){
        document.getElementById("errorString").innerHTML = "Ending date entered is before starting date";
        return false;
    }

    let condition1 = startingTime >= endingTime;
    let condition2 = startDateValue.getTime() === endingDateValue.getTime() ;
    if (condition1 && condition2){
        document.getElementById("errorString").innerHTML = "Ending time entered is before starting time";
        return false;
    }

    if (startDateValue.getDay() === 5 || startDateValue.getDay() === 6 ||
        endingDateValue.getDay() === 5 || endingDateValue.getDay() === 6){
            document.getElementById("errorString").innerHTML = "Schedule cannot start or end on weekend";
            return false;
    }

    let startDateValueString = document.createCalendar.startingDate.value;
    let endingDateValueString = document.createCalendar.endingDate.value;


    let startingTimeString = document.createCalendar.startingTime.value;
    let endingTimeString = document.createCalendar.endingTime.value;

    let timeStep = document.createCalendar.meetingLength.value;
    let scheduleName = document.getElementById("scheduleName").value;


    let sentObject = {
        name : scheduleName,
        startTime : startingTimeString,
        endTIme : endingTimeString,
        delta : timeStep,
        startDate : startDateValueString,
        endDate : endingDateValueString
        };

    let sentObjectString = JSON.stringify(sentObject);

    $.post(requestURL, sentObjectString, function (data, status) {

        if (status >= errorCode) {
            document.getElementById("errorString").innerHTML = "Schedule Could Not Be Created";
            return;
        }

        let newScheduleData = data;

        scheduleID = newScheduleData.id;
        scheduleEditCode = newScheduleData.secretCode;


        document.getElementById("showScheduleID").innerHTML = "Your schedule ID is: " + scheduleID;
        document.getElementById("showScheduleEditCode").innerHTML = "Your secret schedule edit code is: " + scheduleEditCode;

        document.getElementById("redirectButton").style.visibility = "visible";
    });

}

function redirectPage(){

    redirectURL = redirectURL + "?scheduleID=" + scheduleID;

    window.location.href = redirectURL;
}
