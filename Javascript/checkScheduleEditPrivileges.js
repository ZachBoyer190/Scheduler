
function checkEditAbility(){
    let inputCodeArea = document.getElementById("secretCodeScheduleEdit");
    let inputCode = inputCodeArea.value;

    if(inputCode === storedScheduleObject.secretCode){
        document.getElementById("scheduleEditOptions").style.visibility = "visible";
    }
    inputCodeArea.value = "";
}