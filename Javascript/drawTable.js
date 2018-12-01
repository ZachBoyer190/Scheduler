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
const url = 'https://jkp5zoujqi.execute-api.us-east-2.amazonaws.com/Alpha/getschedule';
let scheduleStartDate;
let tableStartDate;

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


let storedScheduleObject;


/*$.getScript("storeScheduleInPage.js")/*, function(){

    alert("Script loaded but not necessarily executed.");

});*/

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

function drawTableFromButton() {
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
        emptyTimeSlots(document.getElementById("scheduleTable"));
        // TODO uncomment this once schedules can be taken from server
        storedScheduleObject = getScheduleFromResponse(data);
        createTableFromObject();
    });

}

function getParameter(){
    let url = window.location.search;
    if(!url.includes("?")){
        return "";
    }
    let paramString = url.split("?")[1];
    return paramString.split("=")[1];
}

function createTableFromObject(){

    let table = document.getElementById("scheduleTable");

    document.getElementById("scheduleName").innerHTML = storedScheduleObject.name;
    scheduleStartDate = storedScheduleObject.startDate;
    generateInitialTableStartDate();
    initWeekShown();

    fillDateRow(table);
    fillTableWithEmptyCells(table);
    fillTimeColumn(table);
    fillTimeSlots(table);
    putScheduleObjectOnPage();
    // TODO create function that actually schedules a meeting and tells secret code to secret code paragraph element
    // TODO add function logic to each button when it is made

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

function fillTimeSlots(htmlTable){

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

        switch(status){
            case "OPEN" :
                cell.appendChild(createOpenCell());
                break;

            case "CLOSED" :
                cell.innerHTML = status;
                break;

            case "BOOKED" :
                cell.appendChild(createBookedCell(thisTimeSlot));
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
    let x = date1.getDay();
    let y = date2.getDay();
    let z = date1.getMonth();
    let w = date2.getMonth();
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

function createOpenCell(){
    let div0 = document.createElement("div");

    let div1 = document.createElement("div");
    let codeField = document.createElement('input');
    codeField.type = "text";
    div1.appendChild(codeField);
    div0.appendChild(div1);

    let btn = document.createElement('input');
    btn.type = "button";
    btn.value = "book now";
    div0.appendChild(btn);
    return div0;
}

function createBookedCell(thisTimeSlot) {

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
    div2.appendChild(cancelBtn);
    div0.appendChild(div2);

    return div0;
}

function initWeekShown() {
    editCurrentWeekShown(startWeek);
    let millisStart = tableStartDate.getTime();
    let millisEnd = storedScheduleObject.endDate.getTime();
    let totalDays = (( millisEnd - millisStart)/(numMillisDay));
    let totalWeeks = Math.ceil(totalDays/numDaysInWeek);
    editTotalWeeksShown(totalWeeks);
    updateWeekLabel()
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

function generateNewTableStartDate(days){

    let newTableStartDate = tableStartDate.getTime() + (days*numMillisDay);

    tableStartDate= new Date(newTableStartDate);
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

function showDifferentWeek(step){

    let newWeek = getCurrentWeekShown()+step;
    if (newWeek > getTotalWeeksShown() || newWeek <= 0 ) {
        return;
    }
    editCurrentWeekShown(newWeek);
    updateWeekLabel();
    tableStartDate = new Date(tableStartDate.setDate(tableStartDate.getDate()+(step*numDaysInWeek)));
    //generateNewTableStartDate(step*numDaysInWeek);

    let table = document.getElementById("scheduleTable");
    fillDateRow(table);
    // TODO fix this to refill in the time column
    fillTimeColumn(table);
    emptyTimeSlots(table);
    fillTimeSlots(table);
    putScheduleObjectOnPage();
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


function putScheduleObjectOnPage(){
    document.getElementById("scheduleString").innerHTML = JSON.stringify(storedScheduleObject);
}


function geScheduleObjectFromPage(){
    storedScheduleObject = JSON.parse(document.getElementById("scheduleString").innerHTML);
}


