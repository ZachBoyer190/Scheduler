
const rowOffset = 2;
const numCol = 6;
const colOffset = 1;
const timeColIndex = 0;
const dateRowIndex = 0;
const dayRowIndex = 0;
const numDaysInWeek = 7;
const numMillisDay = 86400000;
const startWeek = 1;
const url = 'https://jsonplaceholder.typicode.com/posts';
let scheduleStartDate;
let tableStartDate;

// TODO comment this out once a response can be received from the server
const storedScheduleObject = createScheduleObject();

function drawTableFromUrl(){
    let param = getParameter();

    if (param === ""){
        return;
    }
    param = "scheduleID=" + param;
    $.get(url,param, function (data, status) {
        // TODO uncomment this once schedules can be taken from server
        //const storedScheduleObject = data;
        createTableFromObject();
    });

}

function drawTableFromButton() {
    let inputID = document.getElementById("ScheduleID").value;
    if(inputID.length === 0){
        return;
    }
    inputID = "scheduleID=" + inputID;
    $.get(url,inputID, function (data, status) {
        document.getElementById("ScheduleID").value = "";
        // TODO uncomment this once schedules can be taken from server
        //const storedScheduleObject = data;
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
    // TODO create function that actually schedules a meeting and tells secret code to secret code paragraph element
    // TODO add function logic to each button when it is made

}

function fillTableWithEmptyCells(table){
    let numRows = ((storedScheduleObject.endTime-
        storedScheduleObject.startTime)*6/10)/storedScheduleObject.deltaTime;

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
            generateDateString(tableStartDate,j);
    }
}

function generateDateString(startDate, index){
    let currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate()+index);
    let dayString = currentDate.getDate().toString();
    let monthString = (currentDate.getMonth()+1).toString();
    let yearString = currentDate.getFullYear().toString();
    return yearString + "-" + monthString + "-" + dayString ;
}

function fillTimeColumn(htmlTable){
    let numRows = ((storedScheduleObject.endTime-storedScheduleObject.startTime)*6/10)
        /storedScheduleObject.deltaTime;
    let hour = 60; // minutes
    let i;
    let currentTime = storedScheduleObject.startTime;
    for (i = rowOffset; i < numRows+rowOffset; i++) {
        let nonOffsetIndex = i -rowOffset;
        if (nonOffsetIndex !== 0) {
            if (nonOffsetIndex % (hour/storedScheduleObject.deltaTime) === 0) {
                currentTime += 40 + storedScheduleObject.deltaTime ;
            } else {
                currentTime += storedScheduleObject.deltaTime;
            }
        }
        htmlTable.rows[i].cells[timeColIndex].innerHTML = insertCharacter(currentTime.toString(),2,":");
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

    for(let k = 0; k < storedScheduleObject.timeSlots.length; k++){

        let thisTimeSlot = storedScheduleObject.timeSlots[k];

        let timeSlotDate = new Date(thisTimeSlot.date);
        let timeSlotTime = thisTimeSlot.time;

        let timeSlotCol = getTimeSlotCol(timeSlotDate, currentDates);
        let timeSlotRow = getTimeSlotRow(timeSlotTime, currentTimes);

        if (timeSlotCol === timeColIndex || timeSlotRow === dateRowIndex
            || timeSlotRow === dayRowIndex){
            continue;
        }

        let status = thisTimeSlot.status;
        let cell = htmlTable.rows[timeSlotRow].cells[timeSlotCol];

        switch(status){
            case "open" :
                cell.appendChild(createOpenCell());
                break;

            case "closed" :
                cell.innerHTML = status;
                break;

            case "booked" :
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
        currentTimes[n] = subtractColon(thisRow.cells[timeColIndex].innerHTML);
    }
    return currentTimes;
}

function getTimeSlotCol(date, currentDates){
    for (let g = 0; g < currentDates.length; g++) {
        if (date.getTime() === currentDates[g].getTime()){
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
    generateNewTableStartDate(step*numDaysInWeek);

    let table = document.getElementById("scheduleTable");
    fillDateRow(table);
    emptyTimeSlots(table);
    fillTimeSlots(table);
}

function emptyTimeSlots(table) {
    for(let row = rowOffset; row < table.rows.length; row++){
        for (let col = colOffset; col < table.rows[row].cells.length; col++) {
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

function checkEditAbility(){
    let inputCodeArea = document.getElementById("secretCodeScheduleEdit");
    let inputCode = inputCodeArea.value;

    if(inputCode === storedScheduleObject.secretCode){
        document.getElementById("scheduleEditOptions").style.visibility = "visible";
    }
    inputCodeArea.value = "";
}

function createScheduleObject(){
    return {
        startDate: new Date("May 3, 2018"),
        endDate: new Date("May 10, 2018"),
        startTime: 1000,
        endTime: 1100,
        deltaTime: 20,
        secretCode: "12345",
        name : "hi",
        timeSlots: [
            {
                status: "closed",
                time: "1000",
                date: "2018-5-3",
                name: ""
            },

            {
                status: "open",
                time: "1020",
                date: "2018-5-6",
                name: ""
            },

            {
                status: "open",
                time: "1040",
                date: "2018-5-6",
                name: ""
            },

            {
                status: "booked",
                time: "1000",
                date: "2018-5-7",
                name: "Kevin"
            },

            {
                status: "open",
                time: "1020",
                date: "2018-5-7",
                name: ""
            },

            {
                status: "open",
                time: "1040",
                date: "2018-5-7",
                name: ""
            },

            {
                status: "open",
                time: "1000",
                date: "2018-5-8",
                name: ""
            },

            {
                status: "open",
                time: "1020",
                date: "2018-5-8",
                name: ""
            },

            {
                status: "open",
                time: "1040",
                date: "2018-5-8",
                name: ""
            },

            {
                status: "open",
                time: "1000",
                date: "2018-5-9",
                name: ""
            },

            {
                status: "open",
                time: "1020",
                date: "2018-5-9",
                name: ""
            },

            {
                status: "open",
                time: "1040",
                date: "2018-5-9",
                name: ""
            },

            {
                status: "open",
                time: "1000",
                date: "2018-5-10",
                name: ""
            },

            {
                status: "open",
                time: "1020",
                date: "2018-5-10",
                name: ""
            },

            {
                status: "open",
                time: "1040",
                date: "2019-5-10",
                name: ""
            }
        ]
    };
}