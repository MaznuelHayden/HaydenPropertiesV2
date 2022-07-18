const express = require('express')
const nodemailer = require('nodemailer')
const app = express()
const port = 3000
const serverless = require('serverless-http')
require('dotenv').config()



const router = express.Router()
app.use('/Home', express.static('public'))
app.use('/About', express.static('public/About'))
app.use('/Contact', express.static('public/Contact'))
app.use(express.json())
app.use('/.netlify/functions', router)


app.get('/', (req,res)=>{
    res.sendFile(__dirname + "/public/Contact/")
})

app.post('/', (req,res)=>{
  console.log(req.body)

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN
    }
  });
  let mailOptions = {
    from: "haydenpropertiesform@gmail.com",
    to: "manuel@haydenpropertiesinc.com",
    subject: 'Website Client',
    text: `Name: ${req.body.name} \n Email: ${req.body.mail} \n Phone: ${req.body.phone} \n Message: ${req.body.message}`
  };
  transporter.sendMail(mailOptions, function(err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Email sent successfully");
    }
  });
})


app.listen(port, ()=>{
    console.log('server running on port:', port)
})



module.exports.handler = serverless(app)

