const errorCode = 300;
const urlDelete = 'https://jkp5zoujqi.execute-api.us-east-2.amazonaws.com/Charlie/deleteoldschedules';
const urlGet = 'https://jkp5zoujqi.execute-api.us-east-2.amazonaws.com/Charlie/shownewschedules';
const urlUser =  'https://jkp5zoujqi.execute-api.us-east-2.amazonaws.com/Beta/checksysadmin';
let userAndPassValue;
let deleteDate;

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
    let deleteNumberOfDays = document.getElementById("deleteNumberOfDays").value;
    let startDateValue = new Date();

    if(deleteNumberOfDays.length === 0){
        document.getElementById("errorString").innerHTML = "Please insert a number of days";
        return;
    }

    let endDateDelete = new Date(startDateValue.setDate(startDateValue.getDate() - deleteNumberOfDays));

    //document.getElementById("errorString").innerHTML = new Date(endDateDelete).toDateString();

    deleteDate = {
        end_date: endDateDelete
    };

    $.post(urlDelete,JSON.stringify(deleteDate), function (data, status) {
        document.getElementById("deleteNumberOfDays").value = "";

        if (data.httpCode >= errorCode){
            document.getElementById("errorString").innerHTML = "There are no schedules before this date";
        }
        else if (data.httpCode <= errorCode) {
            document.getElementById("errorString").innerHTML = "You have successfully deleted the schedules";
            return;
        }

    });
}



function getSchedulesFromButton(){
    let getNumberOfDays = document.getElementById("getNumberOfDays").value;
    let DateValue = new Date();

    if(getNumberOfDays.length === 0){
        document.getElementById("errorString").innerHTML = "Please insert a number of days";
        return;
    }

    let endDateGet = DateValue - getNumberOfDays;

    getNumberOfDays = {
        date: endDateGet
    };

    $.post(urlGet,JSON.stringify(getNumberOfDays), function (data, status) {
        document.getElementById("getNumberOfDays").value = "";

        if (data.httpCode >= errorCode){
            document.getElementById("errorString").innerHTML = "There are no new schedules after this date";
            return;
        }
       let NewScheduleData = data;

        scheduleName = NewScheduleData.name;
        scheduleID = NewScheduleData.id;


    });

}

function showFunctions(){
        document.getElementById("fieldset1").style.visibility = "visible";
        document.getElementById("fieldset2").style.visibility = "visible";

}

