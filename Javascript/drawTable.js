const errorCode = 300;
const url = 'https://jkp5zoujqi.execute-api.us-east-2.amazonaws.com/Alpha/getschedule';

// =====================================================
//              Templates for Objects
// -----------------------------------------------------

// template for timeslot object
const timeslotTemplate =
    {
        status: "",
        time: 9999,
        date: "",
        name: ""
    };

// template for schedule object
const scheduleObjectTemplate = {
    startDate: new Date(),
        endDate: new Date(),
    startTime: 9999,
    endTime: 9999,
    slotDelta: 9999,
    secretCode: "",
    name : "",
    timeslots: [timeslotTemplate]
};

// =====================================================


function drawTableFromUrl(){
    let param = getParameter();

    // TODO FIX THIS FOR THE LOVE OF GOD
    /*if (param === ""){
        return;
    }
    param = {
        scheduleID: param
    }
    $.post(url,JSON.stringify(param), function (data, status) {

        if(status >= errorCode){
            return;
        }
        // TODO uncomment this once schedules can be taken from server
        //storedScheduleObject = data;
        createTableFromObject();
    });*/

}

function getScheduleFromButton() {
    let inputID = document.getElementById("ScheduleID").value;
    if(inputID.length === 0){
        return;
    }
    inputID = {
        id: inputID
    };
    $.post(url,JSON.stringify(inputID), function (data, status) {
        document.getElementById("ScheduleID").value = "";

        if(data.httpCode >= errorCode){
            return;
        }
        //emptyTimeSlots(document.getElementById("scheduleTable"));
        // TODO uncomment this once schedules can be taken from server
        storedScheduleObject = getScheduleFromResponse(data);
        putScheduleObjectOnPage()
        //createTableFromObject();
    });

}
function getScheduleFromResponse(data){
    storedScheduleObject = data.schedule;
    storedScheduleObject.startDate = new Date(new Date(storedScheduleObject.startDate).setHours(-5));
    storedScheduleObject.endDate = new Date(new Date(storedScheduleObject.endDate).setHours(-5));
    return storedScheduleObject;
}


function putScheduleObjectOnPage(){
    document.getElementById("scheduleString").innerHTML = JSON.stringify(storedScheduleObject);
}


function geScheduleObjectFromPage(){
    storedScheduleObject = JSON.parse(document.getElementById("scheduleString").innerHTML);
}


