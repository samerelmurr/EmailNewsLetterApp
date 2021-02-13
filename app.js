const express = require('express'); //express package 
const https = require('https'); //https package
const bodyParser = require('body-parser'); //body-parser to recive input from html
const { response } = require('express');


const app = express(); //app
const port = 3000; //port number that runs the server

app.use(bodyParser.urlencoded({extended: true})); //line needed to run body-parser
app.use(express.static("public"));


app.get("/", (req, res) => { //.get to send html file

    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {

    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed", 
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);

    const url = "https://us7.api.mailchimp.com/3.0/lists/e1bbb16b8d"
    const options = {
        method: "POST",
        auth: "PotatoCoder:3b599c37be4f0efee10f38a27dc45393-us7"
    }

    const request = https.request(url, options, (response) => {

        if(response.statusCode == 200){

            res.sendFile(__dirname + "/success.html");
        } else {

            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", (data) => {
            console.log(JSON.parse(data));
        })
    });

    //request.write(jsonData);
    request.end();

});
    
app.post("/failure", (req, res) => {
    res.redirect('/');
});
//App API Key
//3b599c37be4f0efee10f38a27dc45393-us7

//Audience ID
//e1bbb16b8d

app.listen(port, () => {

    console.log("Server is up");
});