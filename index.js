
const accountSid = "ACb30a770914c6f1085a02a8c01e258fc5";
const authToken = "18f4216647a2506c6d426bd482a1fd6b";
const client = require('twilio')(accountSid, authToken);
const https = require('https');

let numbers = ['9958624326', '7827649326'];

let url = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=201301&date=" + getDate();

console.log("----------------- Vaccince Checker Started ----------------");
console.log("")
console.log("")
console.log("Checking @ " + getTime() + "...");
vaccineSync();

var minutes = 1, the_interval = minutes * 60 * 1000;
setInterval(function() {
  console.log("Checking again @ " + getTime() + "...");
  vaccineSync();
}, the_interval);

function vaccineSync(){
    https.get(url,(res) => {
        let body = "";
    
        res.on("data", (chunk) => {
            body += chunk;
        });
    
        res.on("end", () => {
            try {
                let json = JSON.parse(body);
                let centers = json.centers;
    
                centers.forEach(center => {
                    if(center.center_id === 608133){
                        let sessions = center.sessions;
                        sessions.forEach(session => {
                            let available = 'NOT AVAILABLE'
                            if(session.available_capacity > 0){
                                available = 'AVAILABLE(' + session.available_capacity + ')';
                                alert(available);    
                            }
                            console.log("date: "+session.date+": "+available)
                        });
                    }
                });
    
                console.log("-----------------------------------------------------------------------------")
                
            } catch (error) {
                console.error(error.message);
            };
        });
    
    }).on("error", (error) => {
        console.error(error.message);
    });
}

function alert(msg){
    numbers.forEach(number => {
        sendSMS(number, 'VACCINE ALERT @ ' + getTime() + ': '+ msg);
    });
}

function sendSMS(number, msg){
    client.messages
    .create({
       body: msg,
       from: '+15097903974',
       to: '+91'  + number
     })
    .then(message => console.log(message.sid));
}

function getTime(){
    return new Date().toLocaleTimeString();
}

function getDate(){
    let dateObj = new Date().toISOString().replace(/T/, ' '). replace(/\..+/, '');
    let date = dateObj.substr(8,2) + "-" + dateObj.substr(5,2) + "-" + dateObj.substr(0,4);
    return date;
}