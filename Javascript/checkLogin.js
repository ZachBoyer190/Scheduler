const errorCode = 300;
const urlDelete = 'https://jkp5zoujqi.execute-api.us-east-2.amazonaws.com/Delta/deleteoldschedules';
const urlGet = 'https://jkp5zoujqi.execute-api.us-east-2.amazonaws.com/Delta/getscheduleshoursold';
const urlUser =  'https://jkp5zoujqi.execute-api.us-east-2.amazonaws.com/Delta/checksysadmin';
let userAndPassValue;
let deleteDate;
let setNumberOfHours;

function checkLogin(){
    let usernameValue = document.getElementById("username").value;
    let passwordValue = document.getElementById("password").value;


    if(usernameValue.length === 0 && passwordValue.length === 0){
        document.getElementById("errorString").innerHTML = "Please input username and password";
        console.log("no username or password");
    }
    else if(usernameValue.length === 0){
        document.getElementById("errorString").innerHTML = "Please input username";
        console.log("no username");
    }
    else if(passwordValue.length === 0){
        document.getElementById("errorString").innerHTML = "Please input password";
        console.log("no password");
    }
    else{
        document.getElementById("errorString").innerHTML = "";

        userAndPassValue= {
            username: usernameValue,
            password: passwordValue
        };

        $.post(urlUser, JSON.stringify(userAndPassValue), function (data, status) {
            if (data.httpCode >= errorCode) {
                document.getElementById("errorString").innerHTML = "Incorrect Username or Password";
                return;
            }
            else if  (data.httpCode <= errorCode){
                document.getElementById("errorString").innerHTML = "";
                showFunctions();
            }

        });
    }
}

function deleteSchedulesFromButton(){
    let numberOfDays = document.getElementById("numberOfDays").value;
    let startDateValue = new Date();

    if(numberOfDays.length === 0){
        document.getElementById("errorString").innerHTML = "Please insert a number of days";
        return;
    }

    let endDate = new Date(startDateValue.setDate(startDateValue.getDate() - numberOfDays));

    //document.getElementById("errorString").innerHTML = new Date(endDateDelete).toDateString();

    deleteDate = {
        end_date: endDate
    };

    $.post(urlDelete,JSON.stringify(deleteDate), function (data, status) {
        document.getElementById("numberOfDays").value = "";

        if (data.httpCode >= errorCode){
            document.getElementById("errorString").innerHTML = "There are no schedules before this date";
        }
        else if (data.httpCode <= errorCode) {
            document.getElementById("errorString").innerHTML = "You have successfully deleted the schedules";
            return;
        }

    });
}


function fillTableWithEmptyCells(table, numRows, numCol, rowOffset){

    for(let j = rowOffset; j < numRows+rowOffset; j++){
        let row = table.insertRow();

        for (let h = 0; h < numCol; h++){
            row.insertCell();
        }
    }
}

function getSchedulesFromButton(){
    let numberOfHours = document.getElementById("numberOfHours").value;

    if(numberOfHours.length === 0){
        document.getElementById("errorString").innerHTML = "Please insert a number of hours";
        return;
    }

    setNumberOfHours = {
        hours: Math.floor(parseInt(numberOfHours)).toString()
    };

    $.post(urlGet,JSON.stringify(setNumberOfHours), function (data, status) {
        document.getElementById("scheduleName").innerHTML = "";
        document.getElementById("numberOfHours").value = "";
        document.getElementById("Header").innerHTML = "";

        if (data.httpCode >= errorCode){
            document.getElementById("Header").innerHTML = "";
            document.getElementById("scheduleName").innerHTML = "";
            document.getElementById("errorString").innerHTML = "There are no new schedules".bold();
            return;
        }
        else if(data.httpCode <= errorCode){
            document.getElementById("scheduleName").innerHTML = "";
            document.getElementById("errorString").innerHTML = "";
            let newScheduleData = data.schedules;

            let i;
            for (i = 0; i < newScheduleData.length; i++) {
                document.getElementById("Header").innerHTML = "Schedule Name: Schedule ID".bold();
                document.getElementById("scheduleName").innerHTML = document.getElementById("scheduleName").innerHTML + '<br>'
                    + newScheduleData[i].name + ": "  + newScheduleData[i].scheduleID;
                //document.getElementById("scheduleID").innerHTML = document.getElementById("scheduleID").innerText + "  " + newScheduleData[i].scheduleID;
            }
        }

    });

}

function showFunctions(){
        document.getElementById("fieldset1").style.visibility = "visible";
        document.getElementById("fieldset2").style.visibility = "visible";

}

