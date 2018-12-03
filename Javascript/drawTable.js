// TODO decide how to refresh list of booked cells when a meeting is booked


// =====================================================
//              Constants for calculations
// -----------------------------------------------------
const errorCode = 300;
const scheduleRowOffset = 2; // rows
const scheduleNumCol = 6;
const scheduleColOffset = 1; // columns
const timeColIndex = 0;
const dateRowIndex = 0;
const dayRowIndex = 0;
const numDaysInWeek = 7;
const numMillisDay = 86400000;
const startWeek = 1;
const errorValue = -1;

const openSlotsRowOffset = 1; //column
const openSlotsNumCol = 6;

const openMeetingURL = 'https://jkp5zoujqi.execute-api.us-east-2.amazonaws.com/Alpha/getschedule';
const closeMeetingURL = 'https://jkp5zoujqi.execute-api.us-east-2.amazonaws.com/Alpha/getschedule';
const url = 'https://jkp5zoujqi.execute-api.us-east-2.amazonaws.com/Alpha/getschedule';
const checkEditCodeURL = 'https://jkp5zoujqi.execute-api.us-east-2.amazonaws.com/Alpha/getschedule';
const cancelMeetingOrganizerURL = 'https://jkp5zoujqi.execute-api.us-east-2.amazonaws.com/Alpha/getschedule';
const closeTimeSlotURL = 'https://jkp5zoujqi.execute-api.us-east-2.amazonaws.com/Alpha/getschedule';
const openTimeSlotURL = 'https://jkp5zoujqi.execute-api.us-east-2.amazonaws.com/Alpha/getschedule';
const closeMultipleAtTimeURL = 'https://jkp5zoujqi.execute-api.us-east-2.amazonaws.com/Alpha/getschedule';
const closeMultipleOnDayURL = 'https://jkp5zoujqi.execute-api.us-east-2.amazonaws.com/Alpha/getschedule';
const openMultipleAtTimeURL = 'https://jkp5zoujqi.execute-api.us-east-2.amazonaws.com/Alpha/getschedule';
const openMultipleOnDayURL = 'https://jkp5zoujqi.execute-api.us-east-2.amazonaws.com/Alpha/getschedule';
const extendScheduleURL = 'https://jkp5zoujqi.execute-api.us-east-2.amazonaws.com/Alpha/getschedule';
const allOpenTimeSlotsURL = 'https://jkp5zoujqi.execute-api.us-east-2.amazonaws.com/Alpha/getschedule';

const bookMeetingButtonStatus = "BOOK";
const cancelMeetingButtonStatus = "CANCEL";

const openTimeSlotButtonStatus = "OPEN";
const closeTimeSlotButtonStatus = "CLOSE";

const participantStatus = "PARTICIPANT";
const organizerStatus = "ORGANIZER";

const searchOpen = "VISIBLE";
const searchClosed = "HIDDEN";

const editOptionOpenDay = "OPEN_DAY";
const editOptionOpenTime = "OPEN_TIME";
const editOptionCloseDay = "CLOSE_DAY";
const editOptionCloseTime = "CLOSE_TIME";
const NoneSelected = "NONE";

let scheduleStartDate;
let tableStartDate;
let storedScheduleObject;
let viewStatus = participantStatus;
let searchStatus = searchClosed;
let openSlotsInSchedule;
let unfilteredStoredOpenSlots;
let filteredStoredOpenSlots;

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
        schedule : scheduleObjectTemplate,
        openSlots : []
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
        document.getElementById("searchOpenSlotsArea").style.visibility = "visible";
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

    sendPostAndRefresh(thisURL, sentObject);
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
        document.getElementById("searchOpenSlotsArea").style.visibility = "hidden";
    document.getElementById("filterOpenSlotOptionsResults").style.visibility = "hidden";
        fillTimeDropdown(table, document.getElementById("selectTime"));
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

    sendPostAndRefresh(thisURL, sentObject);
}
function modifyMultipleTimeSlots() {

    let editChoice = document.getElementById("selectedEdit").value;

    if(editChoice === NoneSelected){
        return;
    }

    let sentObject;

    if (editChoice === editOptionOpenDay || editChoice === editOptionCloseDay){
        let dayChoice = document.getElementById("selectDay").value;
        if(dayChoice === NoneSelected){
            return;
        }
        sentObject = {
            day : new Date(getDateFromDay(dayChoice)),
            id : storedScheduleObject.id

        }
    } else if(editChoice === editOptionOpenTime || editChoice === editOptionCloseTime){
        let timeChoice = document.getElementById("selectTime").value;
        if(timeChoice === NoneSelected){
            return;
        }
        sentObject = {
            time : parseInt(timeChoice),
            id : storedScheduleObject.id

        }
    }
    let thisURL;
    switch (editChoice) {
        case editOptionCloseTime :
            thisURL = closeMultipleAtTimeURL;
            break;
        case editOptionCloseDay :
            thisURL = closeMultipleOnDayURL;
            break;
        case editOptionOpenTime :
            thisURL =openMultipleAtTimeURL;
            break;
        case editOptionOpenDay :
            thisURL =openMultipleOnDayURL;
            break;
    }
    sendPostAndRefresh(thisURL, sentObject);

}

function extendTimeSlots() {
    let newStartingDateInput = document.getElementById("newStartingDate").value;
    let newEndingDateInput = document.getElementById("newEndingDate").value;

    let newStartDate;
    let newEndDate;

    let currentStartDate = storedScheduleObject.startDate;
    let currentEndDate = storedScheduleObject.endDate;

    if(newStartingDateInput === "" && newEndingDateInput === ""){
        return;
    } if(newStartingDateInput !== "") {
        newStartDate = new Date(newStartingDateInput);
    } else{
        newStartDate = currentStartDate;
    } if (newEndingDateInput !== ""){
        newEndDate = new Date(newEndingDateInput);
    } else {
        newEndDate = currentEndDate;
    }

    if(newStartDate.getTime() > currentStartDate.getTime()
        || newEndDate.getTime() < currentEndDate.getTime()
            || (newStartDate.getTime() === currentStartDate.getTime()
                && newEndDate.getTime() === currentEndDate.getTime()) ){
        return;
    }

    let sentObject = {
        id : storedScheduleObject.id,
        startDate : newStartDate,
        endDate : newEndDate
    };

    sendPostAndRefresh(extendScheduleURL, sentObject);
}

function getAllOpenTimeSlots(){

    let sentObject =
        {
            id : storedScheduleObject.id
        };

    // TODO uncomment this once the lambda fcn works
    //$.post(allOpenTimeSlotsURL,JSON.stringify(sentObject), function (data) {

    //    if(data.httpCode >= errorCode){ return; }

        openSlotsInSchedule = storedScheduleObject.timeslots;//data.openSlots;
        document.getElementById("filterOpenSlotOptionsResults").style.visibility = "visible";
        let table = document.getElementById("resultsTable");
        unfilteredStoredOpenSlots = openSlotsInSchedule;
        filteredStoredOpenSlots = openSlotsInSchedule;
        searchStatus = searchOpen;
        fillTableWithEmptyCells(table,openSlotsInSchedule.length,openSlotsNumCol,openSlotsRowOffset);
        drawOpenTimeSlots(table, openSlotsInSchedule);
        fillTimeDropdown(document.getElementById("scheduleTable"), document.getElementById("Time"));
        fillYearDropDown();
        fillMonthDropDown();
        fillDayOfMonthDropDown();
        fillDayOfWeekDropDown();
    //});
}

function filterAllOpenTimeSlots(){
    let yearDropdownValue = document.getElementById("Year").value;
    let monthDropdownValue = document.getElementById("Month").value;
    let dayOfMonthDropdownValue = document.getElementById("DayOfMonth").value;
    let dayOfWeekDropdownValue = document.getElementById("DayOfWeek").value;
    let timeDropdownValue = document.getElementById("Time").value;
    let filterStrings = [yearDropdownValue,monthDropdownValue,dayOfMonthDropdownValue,dayOfWeekDropdownValue,timeDropdownValue]

    let filters = [];
    for (let u = 0; u < filterStrings.length; u++){
        let thisValue = errorValue;
        if(filterStrings[u] !== NoneSelected){
            thisValue = (parseInt(filterStrings[u]));
        }
        filters.push(thisValue);
    }

    filteredStoredOpenSlots = filterOpenSlots(filters);
    drawOpenTimeSlots(document.getElementById("resultsTable"));
}

// =====================================================
//              Helper Functions
// -----------------------------------------------------
function filterOpenSlots(filters){
    let opentSlots = [];
    for(let t = 0; t < unfilteredStoredOpenSlots.length; t++){
        let thisOpenSlot = unfilteredStoredOpenSlots[t];
        let thisOpenSlotDate = new Date(thisOpenSlot.startDate);
        let addSlot = 0;
        let numValidFilters = 5;
        for(let g = 0; g < filters.length; g++){
            if(filters[g] === errorValue){
                numValidFilters--;
            }
            switch(g){
                case 0 :
                    if(filters[g] === thisOpenSlotDate.getFullYear()){
                        addSlot++;
                    }
                    break;
                case 1 :
                    if(filters[g] === thisOpenSlotDate.getMonth()) {
                        addSlot++;
                    }
                    break;
                case 2 :
                    if(filters[g] === thisOpenSlotDate.getDate()) {
                        addSlot++;
                    }
                    break;
                case 3 :
                    if(filters[g] === thisOpenSlotDate.getDay()) {
                        addSlot++;
                    }
                    break;
                case 4 :
                    if(filters[g] === thisOpenSlot.startTime) {
                        addSlot++;
                    }
                    break;
            }
            if(addSlot === numValidFilters){
                opentSlots.push(thisOpenSlot);
                break;
            }
        }
    }
    return opentSlots;
}

function sendPostAndRefresh(thisURL, sentObject){
    // TODO uncomment post request when lambda functions are set up
    /*
        $.post(thisURL,JSON.stringify(sentObject), function (data) {

            if(data.httpCode >= errorCode){ return; }

            storedScheduleObject = getScheduleFromResponse(data);

            drawSchedule(document.getElementById("scheduleTable"));

        });
    */
}

function drawOpenTimeSlots(table) {
    emptyTableRowsSlots(table, openSlotsRowOffset);
    fillEntriesInOpenSlotTable(table, filteredStoredOpenSlots);
}

function fillEntriesInOpenSlotTable(table){
    for(let row = openSlotsRowOffset; row < filteredStoredOpenSlots.length + openSlotsRowOffset; row++){
        let thisTimeSlot = filteredStoredOpenSlots[row - openSlotsRowOffset];
        let date = new Date(thisTimeSlot.startDate);
        for(let col = 0; col < openSlotsNumCol; col++){
            let thisCell = table.rows[row].cells[col];
            switch(col){
                case 0 :
                    thisCell.innerHTML = date.getFullYear().toString();
                    break;
                case 1 :
                    thisCell.innerHTML = getMonthString(date);
                    break;
                case 2 :
                    thisCell.innerHTML = date.getDate().toString();
                    break;
                case 3 :
                    thisCell.innerHTML = getDayString(date);
                    break;
                case 4 :
                    thisCell.innerHTML = thisTimeSlot.startTime;
                    break;
                case 5 :
                    thisCell.appendChild(createParticipantOpenCell(thisTimeSlot));
                    break;
            }

        }

    }
}

function drawSchedule(table){
    emptyTableRowsSlots(table,scheduleRowOffset);
    updateWeekLabel();
    fillDateRow(table);
    fillTimeColumn(table);
    fillTimeSlots(viewStatus,table);
    if(searchStatus === searchOpen) {
        fillEntriesInOpenSlotTable(document.getElementById("resultsTable"))
    }
}

function initializeSchedule(table){
    let numRows = ((storedScheduleObject.endTime-
        storedScheduleObject.startTime)*6/10)/storedScheduleObject.slotDelta;

    fillTableWithEmptyCells(table, numRows, scheduleNumCol, scheduleRowOffset);
    document.getElementById("scheduleName").innerHTML = storedScheduleObject.name;
    scheduleStartDate = storedScheduleObject.startDate;
    generateInitialTableStartDate();
    setTotalWeekShown();
    editCurrentWeekShown(startWeek);
}

function fillTableWithEmptyCells(table, numRows, numCol, rowOffset){

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
        htmlTable.rows[dateRowIndex].cells[j+scheduleColOffset].innerHTML =
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
    for (i = scheduleRowOffset; i < numRows+scheduleRowOffset; i++) {
        let nonOffsetIndex = i - scheduleRowOffset;
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
        currentDates[m] = new Date(row.cells[m+scheduleColOffset].innerHTML);
    }
    return currentDates;
}

function getCurrentTimes(htmlTable){
    let currentTimes = [];
    for (let n = 0; n < htmlTable.rows.length - scheduleRowOffset; n++) {
        let thisRow = htmlTable.rows[n + scheduleRowOffset];
        currentTimes[n] = parseInt(subtractColon(thisRow.cells[timeColIndex].innerHTML));
    }
    return currentTimes;
}

function getTimeSlotCol(date, currentDates){
    for (let g = 0; g < currentDates.length; g++) {
        if (compareDates(date, currentDates[g])){
            return g + scheduleColOffset;
        }
    }
    return timeColIndex;
}

function getTimeSlotRow(time, currentTimes){
    for (let g = 0; g < currentTimes.length; g++) {
        if (time === currentTimes[g]){
            return g + scheduleRowOffset;
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
    cancelBtn.onclick = function(){modifyTimeSlot(cancelMeetingButtonStatus,cancelBtn)};
    div0.appendChild(cancelBtn);

    let closeBtn = document.createElement('input');
    closeBtn.type = "button";
    closeBtn.value = "close time slot";
    closeBtn.id = timeslot.timeSlotId;
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

function emptyTableRowsSlots(table, rowOffset) {
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


function fillTimeDropdown(table, dropDownItem){
    let timesWithoutColons = getCurrentTimes(table);
    let select = dropDownItem;
    for (let t = 0; t < timesWithoutColons.length ; t++){
        let time = timesWithoutColons[t];
        let timeString = time.toString();
        if (time < 1000){
            timeString = "0" + timeString;
        }
        let option = document.createElement("option");
        option.value = time;
        option.innerHTML = insertCharacter(timeString,2,":");
        select.add(option);
    }
}

function getDateFromDay(dayChoice){
    let table = document.getElementById("scheduleTable");

    let colOfDate = 0;
    for(let m = 1; m < 6; m++){
        let tableDay = ((table.rows[1].cells[m].innerHTML).toUpperCase()).replace(/\s+/g, '');
        if( tableDay === dayChoice){
            colOfDate = m;
            break;
        }
    }

    return new Date(table.rows[0].cells[colOfDate].innerHTML);
}

function getMonthString(date){
    let months = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    return months[date.getMonth()];
}

function getDayString(date){
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[date.getDay()];
}

function fillYearDropDown(){
    let select = document.getElementById("Year");

    for(let i = 2018; i < 2075; i++){
        let newOption = document.createElement("option");
        newOption.value = i.toString();
        newOption.innerHTML = i.toString();
        select.appendChild(newOption);
    }
}
function fillMonthDropDown(){
    let months = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    let select = document.getElementById("Month");

    for(let i = 0; i < months.length; i++){
        let newOption = document.createElement("option");
        newOption.value = i.toString();
        newOption.innerHTML = months[i];
        select.appendChild(newOption);
    }
}

function fillDayOfMonthDropDown(){
    let select = document.getElementById("DayOfMonth");

    for(let i = 1; i <= 31; i++){
        let newOption = document.createElement("option");
        newOption.value = i.toString();
        newOption.innerHTML = i.toString();
        select.appendChild(newOption);
    }
}

function fillDayOfWeekDropDown(){
    let months = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    let select = document.getElementById("DayOfWeek");

    for(let i = 0; i < months.length; i++){
        let newOption = document.createElement("option");
        newOption.value = (i+1).toString();
        newOption.innerHTML = months[i];
        select.appendChild(newOption);
    }
}