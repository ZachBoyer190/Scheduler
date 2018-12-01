const errorCode = 300;
const urlDelete = 'https://jkp5zoujqi.execute-api.us-east-2.amazonaws.com/Alpha/deleteOldSchedules';
const urlGet = 'https://jkp5zoujqi.execute-api.us-east-2.amazonaws.com/Alpha/showNewSchedules';
const urlUser =  'https://jkp5zoujqi.execute-api.us-east-2.amazonaws.com/Alpha/checkLogin';
let userAndPassValue;

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
            id: usernameValue,
            id2: passwordValue
        };

        $.post(urlUser,JSON.stringify(userAndPassValue), function (data, status) {
            if (data.httpCode >= errorCode) {
                return;
            }

        });
    }
}

function deleteSchedulesFromButton(){
    let deleteNumberOfDays = document.getElementById("deleteNumberOfDays").value;
    if(deleteNumberOfDays.length === 0){
        return;
    }
    deleteNumberOfDays = {
        id: deleteNumberOfDays
    };

    $.post(urlDelete,JSON.stringify(deleteNumberOfDays), function (data, status) {
        document.getElementById("deleteNumberOfDays").value = "";

        if (data.httpCode >= errorCode) {
            return;
        }

    });
}



function getSchedulesFromButton(){
    let getNumberOfDays = document.getElementById("getNumberOfDays").value;
    if(getNumberOfDays.length === 0){
        return;
    }
    getNumberOfDays = {
        id: getNumberOfDays
    };

    $.post(urlGet,JSON.stringify(getNumberOfDays), function (data, status) {
        document.getElementById("getNumberOfDays").value = "";

        if(data.httpCode >= errorCode){
            return;
        }
    });

}

function showFunctions(){
    if(checkLogin()) {
        document.getElementById("fieldset1").style.visibility = "visible";
        document.getElementById("fieldset2").style.visibility = "visible";
    }

}

