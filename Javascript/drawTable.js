// TODO create function that actually schedules a meeting and tells secret code to secret code paragraph element
// TODO add function logic to each button when it is made

// =====================================================
//              Constants for calculations
// -----------------------------------------------------
const errorCode = 300;
const rowOffset = 2; // rows
const numCol = 6;
const colOffset = 1; // columns
const timeColIndex = 0;
const dateRowIndex = 0;
const dayRowIndex = 0;
const numDaysInWeek = 7;
const numMillisDay = 86400000;
const startWeek = 1;
const openMeetingURL = 'https://jkp5zoujqi.execute-api.us-east-2.amazonaws.com/Alpha/getschedule';
const closeMeetingURL = 'https://jkp5zoujqi.execute-api.us-east-2.amazonaws.com/Alpha/getschedule';
const url = 'https://jkp5zoujqi.execute-api.us-east-2.amazonaws.com/Alpha/getschedule';
const checkEditCodeURL = 'https://jkp5zoujqi.execute-api.us-east-2.amazonaws.com/Alpha/getschedule';
const cancelMeetingOrganizerURL = 'https://jkp5zoujqi.execute-api.us-east-2.amazonaws.com/Alpha/getschedule';
const closeTimeSlotURL = 'https://jkp5zoujqi.execute-api.us-east-2.amazonaws.com/Alpha/getschedule';
const openTimeSlotURL = 'https://jkp5zoujqi.execute-api.us-east-2.amazonaws.com/Alpha/getschedule';

const bookMeetingButtonStatus = "BOOK";
const cancelMeetingButtonStatus = "CANCEL";

const openTimeSlotButtonStatus = "OPEN";
const closeTimeSlotButtonStatus = "CLOSE";

const participantStatus = "PARTICIPANT";
const organizerStatus = "ORGANIZER";

let scheduleStartDate;
let tableStartDate;
let storedScheduleObject;
let viewStatus = participantStatus;

// =====================================================
//              Templates for Objects
// -----------------------------------------------------
const timeslotTemplate =
    {
        status: "",
        time: 9999,
        date: "",
        name: "",
        timeSlotId : ""
    };

const scheduleObjectTemplate =
    {
        startDate: new Date(),
            endDate: new Date(),
        startTime: 9999,
        endTime: 9999,
        slotDelta: 9999,
        id : "",
        //secretCode: "",
        name : "",
        timeslots: [timeslotTemplate]
    };

// noinspection JSUnusedGlobalSymbols
const dataObjectTemplate =
    {
        httpCode : 999,
        schedule : scheduleObjectTemplate
    };
// =====================================================
//              Button Click Handlers
// -----------------------------------------------------
function drawTableFromButton() {
    let inputID = document.getElementById("ScheduleID").value;
    if(inputID.length === 0){
        return;
    }

    $.post(url,JSON.stringify({id: inputID}), function (data) {
        document.getElementById("ScheduleID").value = "";

        if(data.httpCode >= errorCode){
            return;
        }
        storedScheduleObject = getScheduleFromResponse(data);

        let table = document.getElementById("scheduleTable");

        initializeSchedule(table);
        drawSchedule(table);
    });
}

function showDifferentWeek(step){

    let newWeek = getCurrentWeekShown() + step;
    if (newWeek > getTotalWeeksShown() || newWeek <= 0 ) {
        return;
    }
    editCurrentWeekShown(newWeek);

    tableStartDate = new Date(tableStartDate.setDate(
        tableStartDate.getDate()+(step*numDaysInWeek)));

    drawSchedule(document.getElementById("scheduleTable"));
}

function modifyMeeting(status, btnElement, fieldEntry) {

    let textBoxEntry = fieldEntry.value;
    if (textBoxEntry.length === 0){
        return;
    }
    let sentObject;

    let thisURL;

    switch(status){
        case bookMeetingButtonStatus :
            sentObject = {
                timeSlotId : btnElement.id,
                name : textBoxEntry
            };
            thisURL = openMeetingURL;
            break;

        case cancelMeetingButtonStatus :
            sentObject = {
                meetingSecretCode : textBoxEntry
            };
            thisURL = closeMeetingURL;
            break;
    }
    // TODO uncomment post request when lambda functions are set up
/*
    $.post(thisURL,JSON.stringify(sentObject), function (data) {

        if(data.httpCode >= errorCode){ return; }

        storedScheduleObject = getScheduleFromResponse(data);

        drawSchedule(document.getElementById("scheduleTable"));
    });
*/
}

function checkEditAbility(){

    let inputCodeArea = document.getElementById("secretCodeScheduleEdit");
    if (storedScheduleObject === undefined){

        inputCodeArea.value = "";
        return;
    }
    let sentObject = {
        id : storedScheduleObject.id,
        secretCode : inputCodeArea.value
    };

    // TODO uncomment this post request when lambda function exists
    //$.post(checkEditCodeURL,JSON.stringify(sentObject), function (data) {

    //    if(data.httpCode >= errorCode){ return; }

        viewStatus = organizerStatus;
        let table = document.getElementById("scheduleTable");
        drawSchedule(table);
        document.getElementById("scheduleEditOptions").style.visibility = "visible";
        fillTimeDropdown(table);
    //});

    inputCodeArea.value = "";
}

function modifyTimeSlot(status, btnElement) {

    let sentObject= {
        timeSlotId : btnElement.id,
    };
    let thisURL;

    switch(status){

        case cancelMeetingButtonStatus :
            console.log(status);
            thisURL = cancelMeetingOrganizerURL;
            break;

        case openTimeSlotButtonStatus :
            console.log(status);
            thisURL = openMeetingURL;
            break;

        case closeTimeSlotButtonStatus :
            console.log(status);
            thisURL = closeMeetingURL;
            break;
    }
    // TODO uncomment post request when lambda functions are set up
    /*
        $.post(thisURL,JSON.stringify(sentObject), function (data) {

            if(data.httpCode >= errorCode){ return; }

            storedScheduleObject = getScheduleFromResponse(data);

            drawSchedule(document.getElementById("scheduleTable"));
        });
    */
}
// =====================================================
//              Helper Functions
// -----------------------------------------------------
function drawSchedule(table){
    emptyTimeSlots(table);
    updateWeekLabel();
    fillDateRow(table);
    fillTimeColumn(table);
    fillTimeSlots(viewStatus,table);
}

function initializeSchedule(table){
    fillTableWithEmptyCells(table);
    document.getElementById("scheduleName").innerHTML = storedScheduleObject.name;
    scheduleStartDate = storedScheduleObject.startDate;
    generateInitialTableStartDate();
    setTotalWeekShown();
    editCurrentWeekShown(startWeek);
}

function fillTableWithEmptyCells(table){
    let numRows = ((storedScheduleObject.endTime-
        storedScheduleObject.startTime)*6/10)/storedScheduleObject.slotDelta;

    for(let j = rowOffset; j < numRows+rowOffset; j++){
        let row = table.insertRow();

        for (let h = 0; h < numCol; h++){
            row.insertCell();
        }
    }
}

function fillDateRow(htmlTable){
    let j;
    for (j = 0; j < 5; j++){
        htmlTable.rows[dateRowIndex].cells[j+colOffset].innerHTML =
            generateDateString(j);
    }
}

function generateDateString(index){
    let currentDate = new Date(getTableDate());//new Date(startDate);
    currentDate.setDate(currentDate.getDate()+index);
    let dayString = (currentDate.getDate()+1).toString();
    let monthString = (currentDate.getMonth()+1).toString();
    let yearString = currentDate.getFullYear().toString();
    return yearString + "-" + monthString + "-" + dayString ;
}

function getTableDate() {
    return tableStartDate.getTime();

}

function fillTimeColumn(htmlTable){
    let numRows = ((storedScheduleObject.endTime-storedScheduleObject.startTime)*6/10)
        /storedScheduleObject.slotDelta;
    let hour = 60; // minutes
    let i;
    let currentTime = storedScheduleObject.startTime;
    for (i = rowOffset; i < numRows+rowOffset; i++) {
        let nonOffsetIndex = i - rowOffset;
        if (nonOffsetIndex !== 0) {
            if (nonOffsetIndex % (hour / storedScheduleObject.slotDelta) === 0) {
                currentTime += 40 + storedScheduleObject.slotDelta;
            } else {
                currentTime += storedScheduleObject.slotDelta;
            }
        }

        let extraZero = "";
        if (currentTime < 1000) {
            extraZero = "0";
        }
        htmlTable.rows[i].cells[timeColIndex].innerHTML = insertCharacter((extraZero + currentTime.toString()), 2, ":");
    }
}

function insertCharacter(string, index, character){
    let stringA = string.slice(0,index);
    let stringB = string.slice(index,string.length);
    return stringA + character + stringB;
}

function fillTimeSlots(userStatus, htmlTable){

    let currentDates = getCurrentDates(htmlTable);
    let currentTimes = getCurrentTimes(htmlTable);

    for(let k = 0; k < storedScheduleObject.timeslots.length; k++){

        let thisTimeSlot = storedScheduleObject.timeslots[k];

        let timeSlotDate = new Date(new Date(thisTimeSlot.startDate).setHours(-5));
        let timeSlotTime = thisTimeSlot.startTime;

        let timeSlotCol = getTimeSlotCol(timeSlotDate, currentDates);
        let timeSlotRow = getTimeSlotRow(timeSlotTime, currentTimes);

        if (timeSlotCol === timeColIndex || timeSlotRow === dateRowIndex
            || timeSlotRow === dayRowIndex){
            continue;
        }

        let status = thisTimeSlot.status;
        let cell = htmlTable.rows[timeSlotRow].cells[timeSlotCol];

        switch(userStatus) {
            case participantStatus :
                switch(status){
                    case "OPEN" :
                        cell.appendChild(createParticipantOpenCell(thisTimeSlot));
                        break;
                    case "CLOSED" :
                        cell.innerHTML = status;
                        break;
                    case "BOOKED" :
                        cell.appendChild(createParticipantBookedCell(thisTimeSlot));
                        break;
                }
                break;

            case organizerStatus :
                switch(status){
                    case "OPEN" :
                        cell.appendChild(createOrganizerOpenCell(thisTimeSlot));
                        break;
                    case "CLOSED" :
                        cell.appendChild(createOrganizerClosedCell(thisTimeSlot));
                        break;
                    case "BOOKED" :
                        cell.appendChild(createOrganizerBookedCell(thisTimeSlot));
                        break;
                }
                break;
        }

    }
}

function getCurrentDates(htmlTable){
    let currentDates = new Array(5);
    let row = htmlTable.rows[dateRowIndex];
    for (let m = 0; m < currentDates.length; m++){
        currentDates[m] = new Date(row.cells[m+colOffset].innerHTML);
    }
    return currentDates;
}

function getCurrentTimes(htmlTable){
    let currentTimes = [];
    for (let n = 0; n < htmlTable.rows.length - rowOffset; n++) {
        let thisRow = htmlTable.rows[n + rowOffset];
        currentTimes[n] = parseInt(subtractColon(thisRow.cells[timeColIndex].innerHTML));
    }
    return currentTimes;
}

function getTimeSlotCol(date, currentDates){
    for (let g = 0; g < currentDates.length; g++) {
        if (compareDates(date, currentDates[g])){
            return g + colOffset;
        }
    }
    return timeColIndex;
}

function getTimeSlotRow(time, currentTimes){
    for (let g = 0; g < currentTimes.length; g++) {
        if (time === currentTimes[g]){
            return g + rowOffset;
        }
    }
    return timeColIndex;
}

function compareDates(date1, date2){
    let condition1 = date1.getDate() === date2.getDate();
    let condition2 = date1.getMonth() === date2.getMonth();
    let condition3 = date1.getFullYear() === date2.getFullYear();
    return condition1 && condition2 && condition3;
}

function subtractColon(string) {
    let firstString = string.slice(0,2);
    let lastString = string.slice(3,5);
    return firstString + lastString;

}






// =====================================================
//              Participant Table Cell Functions
// -----------------------------------------------------
function createParticipantOpenCell(timeslot){
    let div0 = document.createElement("div");

    let div1 = document.createElement("div");
    let codeField = document.createElement('input');
    codeField.type = "text";
    div1.appendChild(codeField);
    div0.appendChild(div1);

    let btn = document.createElement('input');
    btn.type = "button";
    btn.value = "book now";
    btn.id = timeslot.timeSlotId;
    btn.onclick = function(){modifyMeeting(bookMeetingButtonStatus, btn, codeField)};
    div0.appendChild(btn);
    return div0;
}

function createParticipantBookedCell(thisTimeSlot) {

    let div0 = document.createElement("div");
    let para = document.createTextNode(thisTimeSlot.name);
    div0.appendChild(para);

    let div1 = document.createElement("div");
    let codeField = document.createElement('input');
    codeField.type = "text";
    div1.appendChild(codeField);
    div0.appendChild(div1);

    let div2 = document.createElement("div");
    let cancelBtn = document.createElement('input');
    cancelBtn.type = "button";
    cancelBtn.value = "Cancel Meeting";
    cancelBtn.id = thisTimeSlot.timeSlotId;
    cancelBtn.onclick = function(){modifyMeeting(cancelMeetingButtonStatus,cancelBtn, codeField)};
    div2.appendChild(cancelBtn);
    div0.appendChild(div2);

    return div0;
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++



// =====================================================
//              Organizer Table Cell Functions
// -----------------------------------------------------
function createOrganizerOpenCell(timeslot){
    let div0 = document.createElement("div");

    let closeBtn = document.createElement('input');
    closeBtn.type = "button";
    closeBtn.value = "close time slot";
    closeBtn.id = timeslot.timeSlotId;
    // TODO fill in function call here
    closeBtn.onclick = function(){modifyTimeSlot(closeTimeSlotButtonStatus, closeBtn)};
    div0.appendChild(closeBtn);

    return div0;
}

function createOrganizerBookedCell(timeslot) {
    let div0 = document.createElement("div");

    let cancelBtn = document.createElement('input');
    cancelBtn.type = "button";
    cancelBtn.value = "cancel meeting";
    cancelBtn.id = timeslot.timeSlotId;
    // TODO fill in function call here
    cancelBtn.onclick = function(){modifyTimeSlot(cancelMeetingButtonStatus,cancelBtn)};
    div0.appendChild(cancelBtn);

    let closeBtn = document.createElement('input');
    closeBtn.type = "button";
    closeBtn.value = "close time slot";
    closeBtn.id = timeslot.timeSlotId;
    // TODO fill in function call here
    closeBtn.onclick = function(){modifyTimeSlot(closeTimeSlotButtonStatus, closeBtn)};
    div0.appendChild(closeBtn);

    return div0;
}

function createOrganizerClosedCell(timeslot){
    let div0 = document.createElement("div");

    let openBtn = document.createElement('input');
    openBtn.type = "button";
    openBtn.value = "open time slot";
    openBtn.id = timeslot.timeSlotId;
    // TODO fill in function call here
    openBtn.onclick = function(){modifyTimeSlot(openTimeSlotButtonStatus,openBtn)};
    div0.appendChild(openBtn);

    return div0;
}
// +++++++++++++++++++++++++++++++++++++++++++++++++++++





function setTotalWeekShown() {
    let millisStart = tableStartDate.getTime();
    let millisEnd = storedScheduleObject.endDate.getTime();
    let totalDays = (( millisEnd - millisStart)/(numMillisDay));
    let totalWeeks = Math.ceil(totalDays/numDaysInWeek);
    editTotalWeeksShown(totalWeeks);
}

function generateInitialTableStartDate() {
    let dayOfWeek = scheduleStartDate.getDay();

    if (dayOfWeek === 0) {
        let scheduleStartMillis = scheduleStartDate.getTime();

        let newTableStartDate = scheduleStartMillis + ((getCurrentWeekShown() - 1) * numDaysInWeek * numMillisDay);

        tableStartDate = new Date(newTableStartDate);
    } else {
        let scheduleStartMillis = scheduleStartDate.getTime();

        let newTableStartDate = (scheduleStartMillis - (dayOfWeek*numMillisDay)) + ((getCurrentWeekShown() - 1) * numDaysInWeek * numMillisDay);

        tableStartDate = new Date(newTableStartDate);
    }
}

function editCurrentWeekShown(newWeek){
    document.getElementById("currentWeek").innerHTML = newWeek.toString();
}

function getCurrentWeekShown(){
    let stringWeek = document.getElementById("currentWeek").innerHTML;
    return parseInt(stringWeek);
}

function editTotalWeeksShown(totalWeek){
    let paragraph = document.getElementById("totalWeeks");
    paragraph.innerHTML = totalWeek;
}

function getTotalWeeksShown(){
    let stringWeek = document.getElementById("totalWeeks").innerHTML;
    return parseInt(stringWeek);
}

function updateWeekLabel(){
    let currentWeek = document.getElementById("currentWeek").innerHTML;
    let totalWeeks = document.getElementById("totalWeeks").innerHTML;
    document.getElementById("weekTag").innerHTML = ("Week " + currentWeek +
        " of " + totalWeeks +" Shown Below");
}

function emptyTimeSlots(table) {
    for(let row = rowOffset; row < table.rows.length; row++){
        for (let col = 0; col < table.rows[row].cells.length; col++) {
            clearChildren(table.rows[row].cells[col]);
        }
    }
}

function clearChildren(element){
    let children = element.childNodes;

    for (let b = 0; b < children.length; b ++){
        element.removeChild(children[b]);
    }

}

function getScheduleFromResponse(data){
    storedScheduleObject = data.schedule;
    storedScheduleObject.startDate = new Date(new Date(storedScheduleObject.startDate).setHours(-5));
    storedScheduleObject.endDate = new Date(new Date(storedScheduleObject.endDate).setHours(-5));
    return storedScheduleObject;
}


function fillTimeDropdown(table){
    // TODO fix way it gets the current times becuase they are wrong
    let timesWithoutColons = getCurrentTimes(table);
    let select = document.getElementById("selectTime");
    for (time in timesWithoutColons){
        let option = document.createElement("option");
        option.value = time;
        option.innerHTML = insertCharacter(time,2,":");
        select.add(option);
    }
}