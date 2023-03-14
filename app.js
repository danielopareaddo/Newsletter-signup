const express = require("express");
const app = express();
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
const firstName = req.body.firstName;
const lastName = req.body.lastName;
const email = req.body.email;
//Set up your data so it corresponds with what needed by mail chimp api and
//then convert it to string JSON
//we will set up for 1member since its 1 entry per person
const data = {
  members:[
  {
    email_address: email,
    status: "subscribed",
    merge_fields:{FNAME: firstName, LNAME: lastName}
  }
 ]
};
//converting your members data into a jsonData
const jsonData = JSON.stringify(data);
const url = "https://us19.api.mailchimp.com/3.0/lists/b5e715ac36"
const options = {method:"POST", auth:"anyString:b7fa269aa245f6392fd5b04b0e0d7d39-us19"}

const request = https.request(url, options, function(response){
if (response.statusCode === 200){
  res.sendFile(__dirname + "/success.html");
}else {
  res.sendFile(__dirname + "/failure.html");
}
 response.on("data", function(data){
   //console.log(JSON.parse(data));
 });
});

request.write(jsonData);
request.end();
});

app.post("/failure", function(req, res){
    res.redirect("/");
});


app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000");
});

// MAIL CHIM API KEY
// b7fa269aa245f6392fd5b04b0e0d7d39-us19

// Audience / List ID
// b5e715ac36
