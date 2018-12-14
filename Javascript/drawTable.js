
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

const baseURL = 'https://jkp5zoujqi.execute-api.us-east-2.amazonaws.com/Echo';
const openMeetingURL = baseURL + '/createmeeting';
const closeMeetingURL = baseURL + '/cancelmeeting';
const getScheduleURL = baseURL + '/getschedule';
const checkEditCodeURL = baseURL + '/checkschedulecode';
const cancelMeetingOrganizerURL = baseURL + '/orgcancelmeeting';
const closeTimeSlotURL = baseURL + '/closetimeslot';
const openTimeSlotURL = baseURL + '/opentimeslot';
const closeMultipleAtTimeURL = baseURL + '/closetime';
const closeMultipleOnDayURL = baseURL + '/closedate';
const openMultipleAtTimeURL = baseURL + '/opentime';
const openMultipleOnDayURL = baseURL + '/opendate';
const extendScheduleURL = baseURL + '/extendschedule';
//const allOpenTimeSlotsURL = baseURL + '/getschedule';

const monthsInYear = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
const daysInWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const daysOfMonth = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14",
    "15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31"];


const bookMeetingButtonStatus = "BOOK";
const cancelMeetingButtonStatus = "CANCEL";
const orgCancelMeetingButtonStatus = "ORGCANCEL";

const openTimeSlotButtonStatus = "OPEN";
const closeTimeSlotButtonStatus = "CLOSE";

const timezone = 5;




const editOptionOpenDay = "OPEN_DAY";
const editOptionOpenTimeSlot = "OPEN_TIMESLOT";
const editOptionCloseDay = "CLOSE_DAY";
const editOptionCloseTimeSlot = "CLOSE_TIMESLOT";
const NoneSelected = "NONE";


const visible = "VISIBLE";
const hidden = "HIDDEN";

const full = "FULL";
const empty = "EMPTY";

const changesYes = "YES";
const changesNo = "NO";


let totalWeeksShown;
let currentWeekShown = startWeek;


let scheduleStartDate;
let tableStartDate;
let storedScheduleObject;

let openSlotsInSchedule;
let unfilteredStoredOpenSlots;
let filteredStoredOpenSlots;

let numRowsInScheduleTable;
let numRowsInOpenSlotsTable;

// =====================================================
//              Statuses for Page View
// -----------------------------------------------------
const afterPageLoad = "afterPageLoad";
const afterGetSchedule = "afterGetSchedule";
const afterViewNewWeek = "afterViewNewWeek";
const afterFilterResultsButtonClick = "afterFilterResultsButtonClick";
const afterFilterIsApplied = "afterFilterIsApplied";
const afterSecretCodeIsSubmitted = "afterSecretCodeIsSubmitted";
const afterEditChangeIsSubmitted = "afterEditChangeIsSubmitted";

let pageStatus = afterPageLoad;

// =====================================================
//              Statuses for Schedule Table
// -----------------------------------------------------
let scheduleTableVisibility = hidden;

let scheduleTableFullness = full;

const notInitialized = "NO";
const initialized = "YES";
let scheduleInitializedStatus = notInitialized;

let hasScheduleChanged = changesNo;

const participantPerspective = "PARTICIPANT";
const organizerPerspective = "ORGANIZER";
let scheduleTablePerspective = participantPerspective;

// =====================================================
//              Statuses for Filter Results Button
// -----------------------------------------------------
let filterResultsButtonVisibility = hidden;

// =====================================================
//      Statuses for Filter Results Options and Table
// -----------------------------------------------------
let filterResultsOptionsTableVisibility = hidden;

let filterResultsOptionsTableFullness = empty;

let filterResultsOptionsTableChangeStatus = changesNo;

let filterResultsOptionsTableInitializedStatus = notInitialized;

// =====================================================
//      Statuses for Schedule Edit Code Submission
// -----------------------------------------------------
let scheduleEditCodeSubmissionVisibility = hidden;

let scheduleEditCodeSubmissionFullness = empty;

// =====================================================
//      Statuses for Schedule Edit Options
// -----------------------------------------------------
let scheduleEditOptionsVisibility = hidden;

let scheduleEditOptionsFullness = empty;





let searchButtonStatus = visible;
let searchResultsStatus = hidden;




// =====================================================
//              Templates for Objects
// -----------------------------------------------------
const participantTemplate =
    {
        name : ""
    };

const meetingObjectTemplate =
    {
        meetingID : "",
        schedule : null,
        timeslot : null,
        participant: participantTemplate,
        secretCode : ""

    };

const timeslotTemplate =
    {

        timeSlotID : "",
        scheduleID : "",
        startTime: 9999,
        date: "",
        status: "",
        meeting: meetingObjectTemplate
    };

const scheduleObjectTemplate =
    {
        startDate: new Date(),
        endDate: new Date(),
        startTime: 9999,
        endTime: 9999,
        slotDelta: 9999,
        scheduleID : "",
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
    let inputField = document.getElementById("ScheduleID");
    let inputID = inputField.value;
    if(inputID.length === 0){
        return;
    }


    $.post(getScheduleURL,JSON.stringify({id: inputID}),
        function (data) {
            if(data.httpCode >= errorCode){ return; }

            storedScheduleObject = getScheduleFromResponse(data);

            clearRowsOfTable(document.getElementById("resultsTable"));

            clearGivenElementValues([inputField]);

            hasScheduleChanged = changesNo;

            if(scheduleInitializedStatus !== initialized){
                //clearRowsOfTable(document.getElementById("scheduleTable"),scheduleRowOffset);
                initializeSchedule(document.getElementById("scheduleTable"));
                scheduleInitializedStatus = initialized;
            }

            drawSchedule(document.getElementById("scheduleTable"));

            changeGivenElementsVisibility([document.getElementById("searchOpenSlotsArea"),
                document.getElementById("filterOpenSlotOptionsResults"),
                document.getElementById("scheduleTable")],
                ["visible", "hidden", "visible"]);
        }
    );
}

function showDifferentWeek(step){
    $.post(getScheduleURL,JSON.stringify({id:storedScheduleObject.scheduleID}), function (data) {

        if (data.httpCode >= errorCode) {
            return;
        }

        storedScheduleObject = data.schedule;
        let newWeek = currentWeekShown + step;
        if (newWeek > totalWeeksShown || newWeek <= 0) {
            return;
        }
        currentWeekShown = newWeek;

        tableStartDate = new Date(tableStartDate.setDate(
            tableStartDate.getDate() + (step * numDaysInWeek)));

        drawSchedule(document.getElementById("scheduleTable"));
    })
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
                scheduleID : storedScheduleObject.scheduleID,
                timeslotID : btnElement.id,
                userName : textBoxEntry
            };
            thisURL = openMeetingURL;
            break;
        case cancelMeetingButtonStatus :
            sentObject = {
                meetingID : btnElement.id,
                meetingSecretCode : textBoxEntry,
                scheduleID : storedScheduleObject.scheduleID
            };
            thisURL = closeMeetingURL;
            break;
    }

    sendPostAndRefresh(thisURL, sentObject, changesYes);
}

function checkEditAbility(){

    let inputCodeArea = document.getElementById("secretCodeScheduleEdit");
    if (storedScheduleObject === undefined){

        inputCodeArea.value = "";
        return;
    }
    let sentObject = {
        scheduleID : storedScheduleObject.scheduleID,
        secretCode : inputCodeArea.value
    };

    $.post(checkEditCodeURL,JSON.stringify(sentObject), function (data) {

        if (data.status === true) {
            scheduleTablePerspective = organizerPerspective;
            let table = document.getElementById("scheduleTable");
            drawSchedule(table);
            clearChildren(document.getElementById("resultsTable"));
            changeGivenElementsVisibility([document.getElementById("scheduleEditOptions"),
                document.getElementById("searchOpenSlotsArea"),
                document.getElementById("filterOpenSlotOptionsResults")],
                ["visible", "hidden", "hidden"]);
            fillTimeDropdown(table, document.getElementById("selectTime"));
        } else {
            window.alert("Incorrect edit code given.")
        }
    });

    inputCodeArea.value = "";
}

function modifyTimeSlot(status, btnElement) {

    let sentObject= {
        timeSlotID : btnElement.id,
        scheduleID : storedScheduleObject.scheduleID
    };
    let thisURL;

    switch(status){

        case cancelMeetingButtonStatus :
            sentObject = {
                meetingID : btnElement.id,
                scheduleID : storedScheduleObject.scheduleID
            };
            thisURL = cancelMeetingOrganizerURL;
            break;

        case openTimeSlotButtonStatus :
            thisURL = openTimeSlotURL;
            break;

        case closeTimeSlotButtonStatus :
            thisURL = closeTimeSlotURL;
            break;
    }

    sendPostAndRefresh(thisURL, sentObject, changesYes);
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
            date : new Date(dayChoice),
            scheduleID : storedScheduleObject.scheduleID

        }
    } else if(editChoice === editOptionOpenTimeSlot || editChoice === editOptionCloseTimeSlot){
        let timeChoice = document.getElementById("selectTime").value;
        if(timeChoice === NoneSelected){
            return;
        }
        sentObject = {
            time : parseInt(timeChoice),
            scheduleID : storedScheduleObject.scheduleID

        }
    }
    let thisURL;
    switch (editChoice) {
        case editOptionCloseTimeSlot :
            thisURL = closeMultipleAtTimeURL;
            break;
        case editOptionCloseDay :
            thisURL = closeMultipleOnDayURL;
            break;
        case editOptionOpenTimeSlot :
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

    let currentStartDate = new Date(storedScheduleObject.startDate);
    let currentEndDate = new Date(storedScheduleObject.endDate);

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
        scheduleID : storedScheduleObject.scheduleID,
        startDate : newStartDate,
        endDate : newEndDate
    };
    scheduleInitializedStatus = notInitialized;
    sendPostAndRefresh(extendScheduleURL, sentObject);
}

function getAllOpenTimeSlots(){
    //sendPostAndRefresh(getScheduleURL, {id: inputID}, changesNo,[document.getElementById("searchOpenSlotsArea"), document.getElementById("filterOpenSlotOptionsResults")],["visible", "hidden"]);

    $.post(getScheduleURL,JSON.stringify({id:storedScheduleObject.scheduleID}), function (data) {

        if (data.httpCode >= errorCode) {
            return;
        }

        storedScheduleObject = data.schedule;
        changeGivenElementsVisibility([document.getElementById("scheduleTable")], ["hidden"]);

        openSlotsInSchedule = getOpenSlots(storedScheduleObject.timeslots);
        changeGivenElementsVisibility([document.getElementById("filterOpenSlotOptionsResults")], ["visible"]);
        let table = document.getElementById("resultsTable");
        unfilteredStoredOpenSlots = openSlotsInSchedule;
        filteredStoredOpenSlots = openSlotsInSchedule;
        searchResultsStatus = visible;
        //clearRowsOfTable(document.getElementById("scheduleTable"));
        clearRowsOfTable(table, openSlotsRowOffset);
        fillTableWithEmptyCells(table, openSlotsInSchedule.length, openSlotsNumCol, openSlotsRowOffset);
        drawOpenTimeSlots(table, openSlotsInSchedule);
        if (filterResultsOptionsTableInitializedStatus === notInitialized) {
            fillTimeDropdown(document.getElementById("scheduleTable"), document.getElementById("Time"));
            fillYearDropDown();
            fillDropDown(document.getElementById("Month"), monthsInYear);
            fillDropDown(document.getElementById("DayOfMonth"),daysOfMonth);
            fillDropDown(document.getElementById("DayOfWeek"), daysInWeek);
            filterResultsOptionsTableInitializedStatus = initialized;
        }
    })
}

function filterAllOpenTimeSlots(){
    $.post(getScheduleURL,JSON.stringify({id:storedScheduleObject.scheduleID}), function (data) {

        if (data.httpCode >= errorCode) {
            return;
        }

        storedScheduleObject = data.schedule;

        let yearDropdownValue = document.getElementById("Year").value;
        let monthDropdownValue = document.getElementById("Month").value;
        let dayOfMonthDropdownValue = document.getElementById("DayOfMonth").value;
        let dayOfWeekDropdownValue = document.getElementById("DayOfWeek").value;
        let timeDropdownValue = document.getElementById("Time").value;
        let filterStrings = [yearDropdownValue, monthDropdownValue, dayOfMonthDropdownValue, dayOfWeekDropdownValue, timeDropdownValue]

        let filters = [];
        for (let u = 0; u < filterStrings.length; u++) {
            let thisValue = errorValue;
            if (filterStrings[u] !== NoneSelected) {
                thisValue = (parseInt(filterStrings[u]));
            }
            filters.push(thisValue);
        }

        //clearRowsOfTable(document.getElementById("scheduleTable"));
        let table = document.getElementById("resultsTable");

        filteredStoredOpenSlots = filterOpenSlots(filters);
        clearRowsOfTable(table);
        fillTableWithEmptyCells(table, filteredStoredOpenSlots.length, openSlotsNumCol, openSlotsRowOffset);

        drawOpenTimeSlots(table);
    })
}

// =====================================================
//              Helper Functions
// -----------------------------------------------------
function clearRowsOfTable(table){
    for(let i = (table.rows.length -1); i > 0 ; i--){
        let row = table.rows[i];
        clearChildren(row);
        table.childNodes[1].removeChild(row);
    }
}

function filterOpenSlots(filters){
    let opentSlots = [];
    for(let t = 0; t < unfilteredStoredOpenSlots.length; t++){
        let thisOpenSlot = unfilteredStoredOpenSlots[t];
        let thisOpenSlotDate = new Date(thisOpenSlot.date);
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
                    if((filters[g]-1) === thisOpenSlotDate.getMonth()) {
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

function drawOpenTimeSlots(table) {
    emptyTableCellsFromRows(table, openSlotsRowOffset);
    fillEntriesInOpenSlotTable(table, filteredStoredOpenSlots);
}

function fillEntriesInOpenSlotTable(table){
    for(let row = openSlotsRowOffset; row < filteredStoredOpenSlots.length + openSlotsRowOffset; row++){
        let thisTimeSlot = filteredStoredOpenSlots[row - openSlotsRowOffset];
        let date = new Date(new Date(thisTimeSlot.date).setUTCHours(5));
        for(let col = 0; col < openSlotsNumCol; col++){
            let thisCell = table.rows[row].cells[col];
            switch(col){
                case 0 :
                    thisCell.innerHTML = date.getFullYear().toString();
                    break;
                case 1 :
                    thisCell.innerHTML = monthsInYear[date.getMonth()];
                    break;
                case 2 :
                    thisCell.innerHTML = date.getDate().toString();
                    break;
                case 3 :
                    thisCell.innerHTML = daysInWeek[date.getDay()-1];
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



function initializeSchedule(table){
    numRowsInScheduleTable = ((storedScheduleObject.endTime-
        storedScheduleObject.startTime)*6/10)/storedScheduleObject.slotDelta;

    fillTableWithEmptyCells(table, numRowsInScheduleTable, scheduleNumCol, scheduleRowOffset);
    document.getElementById("scheduleName").innerHTML = storedScheduleObject.name;
    scheduleStartDate = storedScheduleObject.startDate;
    generateInitialTableStartDate();
    setTotalWeekShown();
    currentWeekShown = startWeek;
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
    currentDate = new Date(currentDate.setDate(currentDate.getDate() + index));
    let dayDate = currentDate;
    let dayString = new Date(dayDate.setDate(dayDate.getDate() + 1)).getDate().toString();
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

        let timeSlotDate = new Date(new Date(thisTimeSlot.date).setUTCHours(timezone));

        let timeSlotTime = thisTimeSlot.startTime;

        let timeSlotCol = getTimeSlotPosition(timeSlotDate, currentDates, scheduleColOffset);
        let timeSlotRow = getTimeSlotPosition(timeSlotTime, currentTimes, scheduleRowOffset);

        if (timeSlotCol === timeColIndex || timeSlotRow === dateRowIndex
            || timeSlotRow === dayRowIndex){
            continue;
        }

        let status = thisTimeSlot.status;
        let cell = htmlTable.rows[timeSlotRow].cells[timeSlotCol];

        switch(userStatus) {
            case participantPerspective :
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

            case organizerPerspective :
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
        currentDates[m] = new Date(new Date(row.cells[m+scheduleColOffset].innerHTML).setUTCHours(5));
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

function getTimeSlotPosition(timeSlotData, comparativeDate, offset){
    for(let g = 0; g<comparativeDate.length; g++) {
        if (timeSlotData === comparativeDate[g] || compareDates(timeSlotData, comparativeDate[g])) {
            return g + offset;
        }
    }
    return 0;
}

function compareDates(date1, date2){
    try {
        return date1.getTime() === date2.getTime();
    } catch{
        return false;
    }
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
    codeField.placeholder = "Name here..."
    div1.appendChild(codeField);
    div0.appendChild(div1);

    let btn = document.createElement('input');
    btn.type = "button";
    btn.value = "book now";
    btn.id = timeslot.timeSlotID;
    btn.onclick = function(){modifyMeeting(bookMeetingButtonStatus, btn, codeField)};
    div0.appendChild(btn);
    return div0;
}

function createParticipantBookedCell(thisTimeSlot) {

    let div0 = document.createElement("div");
    let para = document.createTextNode(thisTimeSlot.meeting.participant.name);
    div0.appendChild(para);

    let div1 = document.createElement("div");
    let codeField = document.createElement('input');
    codeField.type = "text";
    codeField.placeholder = "Meeting edit code here..."
    div1.appendChild(codeField);
    div0.appendChild(div1);

    let div2 = document.createElement("div");
    let cancelBtn = document.createElement('input');
    cancelBtn.type = "button";
    cancelBtn.value = "Cancel Meeting";
    cancelBtn.id = thisTimeSlot.meeting.meetingID;
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
    closeBtn.id = timeslot.timeSlotID;
    closeBtn.onclick = function(){modifyTimeSlot(closeTimeSlotButtonStatus, closeBtn)};
    div0.appendChild(closeBtn);

    return div0;
}

function createOrganizerBookedCell(timeslot) {
    let div0 = document.createElement("div");

    let cancelBtn = document.createElement('input');
    cancelBtn.type = "button";
    cancelBtn.value = "cancel meeting";
    cancelBtn.id = timeslot.meeting.meetingID;
    cancelBtn.onclick = function(){modifyTimeSlot(cancelMeetingButtonStatus,cancelBtn)};
    div0.appendChild(cancelBtn);

    let closeBtn = document.createElement('input');
    closeBtn.type = "button";
    closeBtn.value = "close time slot";
    closeBtn.id = timeslot.timeSlotID;
    closeBtn.onclick = function(){modifyTimeSlot(closeTimeSlotButtonStatus, closeBtn)};
    div0.appendChild(closeBtn);

    return div0;
}

function createOrganizerClosedCell(timeslot){
    let div0 = document.createElement("div");

    let openBtn = document.createElement('input');
    openBtn.type = "button";
    openBtn.value = "open time slot";
    openBtn.id = timeslot.timeSlotID;
    openBtn.onclick = function(){modifyTimeSlot(openTimeSlotButtonStatus,openBtn)};
    div0.appendChild(openBtn);

    return div0;
}
// +++++++++++++++++++++++++++++++++++++++++++++++++++++





function setTotalWeekShown() {
    let totalDays = ((storedScheduleObject.endDate.getTime() - tableStartDate.getTime())/(numMillisDay));
    totalWeeksShown = (Math.ceil(totalDays/numDaysInWeek));
}

function generateInitialTableStartDate() {
    let dayOfWeek = scheduleStartDate.getDay();

    let scheduleStartMillis = scheduleStartDate.getTime();
    let newTableStartDate;

    if (dayOfWeek === 0) {
        newTableStartDate = scheduleStartMillis + ((currentWeekShown - 1) * numDaysInWeek * numMillisDay);
    } else {
        newTableStartDate = (scheduleStartMillis - (dayOfWeek*numMillisDay)) + ((currentWeekShown - 1) * numDaysInWeek * numMillisDay);
    }
    tableStartDate = new Date(newTableStartDate);
}

function updateWeekLabel(){
    document.getElementById("weekTag").innerHTML = ("Week " + currentWeekShown +
        " of " + totalWeeksShown +" Shown Below");
}

function emptyTableCellsFromRows(table, rowOffset) {
    for(let row = rowOffset; row < table.rows.length; row++){
        for (let col = 0; col < table.rows[row].cells.length; col++) {
            clearChildren(table.rows[row].cells[col]);
        }
    }
}

function clearChildren(element){

    while(element.childNodes.length !== 0){
        element.removeChild(element.childNodes[0]);
    }

}

function getScheduleFromResponse(data){
    storedScheduleObject = data.schedule;

    storedScheduleObject.startDate = new Date(new Date(storedScheduleObject.startDate).setUTCHours(timezone));

    storedScheduleObject.endDate = new Date(new Date(storedScheduleObject.endDate).setUTCHours(timezone));

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

function fillYearDropDown(){
    let select = document.getElementById("Year");

    for(let i = 2018; i < 2075; i++){
        let newOption = document.createElement("option");
        newOption.value = i.toString();
        newOption.innerHTML = i.toString();
        select.appendChild(newOption);
    }
}

function fillDropDown(element, options){

    for(let i = 0; i < options.length; i++){
        let newOption = document.createElement("option");
        newOption.value = (i+1).toString();
        newOption.innerHTML = options[i];
        element.appendChild(newOption);
    }
}

function changeGivenElementsVisibility(elements, values) {
    for(let i = 0; i < elements.length; i++){
        elements[i].style.visibility = values[i];
    }
}

function clearGivenElementValues(elements){
    for(let i = 0; i < elements.length; i++){
        elements[i].value = "";
    }
}

function getOpenSlots(timeSlots){
    let openSlots = [];
    for (let v = 0; v < timeSlots.length; v++){
        let thisTimeSlot = timeSlots[v];
        if(thisTimeSlot.status === openTimeSlotButtonStatus) {
            openSlots.push(timeSlots[v]);
        }
    }
    return openSlots;
}


// =====================================================
//              Post and Refresh Function
// -----------------------------------------------------
function sendPostAndRefresh(thisURL, sentObject, scheduleChangeStatusChange, elementArray, elementValues){

    $.post(thisURL,JSON.stringify(sentObject), function (data) {

        if(data.httpCode >= errorCode){
            sendPostAndRefresh(getScheduleURL,{id:storedScheduleObject.scheduleID});
            return;
        }

        if(data.response === "Successfully Created Meeting"){
            let meetingSecretCode = data.secretCode;
            window.alert("Your meeting secret code is: " + meetingSecretCode);
        }

        changeGivenElementsVisibility(
            [document.getElementById("scheduleTable")],["visible"]);

        storedScheduleObject = getScheduleFromResponse(data);

        if(scheduleChangeStatusChange !== undefined) {
            hasScheduleChanged = scheduleChangeStatusChange;
        }

        if(scheduleInitializedStatus !== initialized){
            //clearRowsOfTable(document.getElementById("scheduleTable"),scheduleRowOffset);
            initializeSchedule(document.getElementById("scheduleTable"));
            scheduleInitializedStatus = initialized;
        }

        drawSchedule(document.getElementById("scheduleTable"));
        if(elementArray !== undefined && elementValues !== undefined) {
            if (elementValues.length !== 0 && elementArray !== 0) {
                changeGivenElementsVisibility(elementArray, elementValues);
            }
        }
    });
}


// =====================================================
//              Drawing Functions
// -----------------------------------------------------

function drawSchedule(table){
    emptyTableCellsFromRows(table,scheduleRowOffset);
    updateWeekLabel();
    fillDateRow(table);
    fillTimeColumn(table);
    fillTimeSlots(scheduleTablePerspective,table);
    if(searchResultsStatus === visible) {
        if(hasScheduleChanged === changesYes) {
            fillEntriesInOpenSlotTable(document.getElementById("resultsTable"))
            hasScheduleChanged = changesNo;
        }
    }
}

function refreshDrawPage(){
    let table;
    if(scheduleTableVisibility === visible){
        table = document.getElementById("scheduleTable");
        emptyTableCellsFromRows(table,scheduleRowOffset);

    }
    if(filterResultsOptionsTableVisibility === visible){
        table = document.getElementById("scheduleTable");
        emptyTableCellsFromRows(table,openSlotsRowOffset);
    }


}


// =====================================================
//              Set Status of Elements
// -----------------------------------------------------

function setElementStatuses(givenPageStatus){
    switch(givenPageStatus){

        case afterPageLoad :
            break;
        case afterGetSchedule :
            setStatuses(
                [visible,full,initialized,changesYes,participantPerspective,
                visible,
                    hidden,empty,changesNo,
                    visible,empty,
                    hidden,empty]);
            break;
        case afterViewNewWeek :
            setStatuses(
                [visible,full,initialized,changesYes,participantPerspective,
                    visible,
                    hidden,empty,changesNo,
                    visible,empty,
                    hidden,empty]);
            break;
        case afterFilterResultsButtonClick :
            setStatuses(
                [hidden,empty,notInitialized,changesNo,participantPerspective,
                    hidden,
                    visible,full,changesYes,
                    hidden,empty,
                    hidden,empty]);
            break;
        case afterFilterIsApplied :
            setStatuses(
                [hidden,empty,notInitialized,changesNo,participantPerspective,
                    hidden,
                    visible,full,changesYes,
                    hidden,empty,
                    hidden,empty]);
            break;
        case afterSecretCodeIsSubmitted :
            setStatuses(
                [visible,full,initialized,changesYes,organizerPerspective,
                    hidden,
                    hidden,empty,changesNo,
                    hidden,empty,
                    visible,empty]);
            break;
        case afterEditChangeIsSubmitted :
            setStatuses(
                [visible,full,initialized,changesYes,organizerPerspective,
                    hidden,
                    hidden,empty,changesNo,
                    hidden,empty,
                    visible,empty]);
            break;
        default :
            break;
    }
}

function setStatuses(givenStatuses){

    scheduleTableVisibility = givenStatuses[0];

    scheduleTableFullness = givenStatuses[1];

    scheduleInitializedStatus = givenStatuses[2];

    hasScheduleChanged = givenStatuses[3];

    scheduleTablePerspective = givenStatuses[4];

    filterResultsButtonVisibility = givenStatuses[5];

    filterResultsOptionsTableVisibility = givenStatuses[6];

    filterResultsOptionsTableFullness = givenStatuses[7];

    filterResultsOptionsTableChangeStatus = givenStatuses[8];

    scheduleEditCodeSubmissionVisibility = givenStatuses[9];

    scheduleEditCodeSubmissionFullness = givenStatuses[10];

    scheduleEditOptionsVisibility = givenStatuses[11];

    scheduleEditOptionsFullness = givenStatuses[12];
}






