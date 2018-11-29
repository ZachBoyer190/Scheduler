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
     }


}