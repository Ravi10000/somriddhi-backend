const express = require('express')
const env = require('dotenv')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express();
const cors = require('cors');

mongoose.set('strictQuery', false);
mongoose.Promise = global.Promise;

env.config();

app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())

// app.use("/uploads", express.static("uploads"));

// // app.use((req, res, next) => {
// //   console.log(req.originalUrl);
// //   next();
// // });

// app.use('/api/auth', require('./route/auth'))
// app.use('/api/academic', require('./route/academicYear'))
// app.use('/api/notes', require('./route/notes'))
// app.use('/api/schoolCourse', require('./route/schoolCourse'));
// app.use('/api/course', require('./route/course'))
// app.use('/api/degree', require('./route/degree'))
// app.use('/api/document', require('./route/document'))
// app.use('/api/eduQualification', require('./route/educationQualification'))
// app.use('/api/experience', require('./route/experience'))
// app.use('/api/form', require('./route/form'))
// app.use('/api/forms', require('./route/forms'))
// app.use('/api/form-response', require('./route/formResponse'))
// app.use('/api/school', require('./route/school'))
// app.use('/api/schoolClass', require('./route/schoolClass'))
// app.use('/api/studentClass', require('./route/studentClass'))
// app.use('/api/class', require('./route/class'));
// app.use('/api/schoolClassType', require('./route/schoolClassType'));
// app.use('/api/admission', require('./route/admission'))
// app.use('/api/attendance', require('./route/attendance'))
// app.use('/api/subject', require('./route/subject'))
// app.use('/api/teacher', require('./route/teacher'))
// app.use('/api/timetable', require('./route/timetable'))
// app.use('/api/affiliation', require('./route/affiliation'))
// app.use('/api/staff', require('./route/staff'))
// app.use('/api/student', require('./route/student'))
// app.use('/api/gallery', require('./route/gallery'))
// app.use('/api/semester', require('./route/semester'))

app.use('/api/banner', require('./route/banner'))
app.use('/api/category', require('./route/category'))
app.use('/api/deal', require('./route/deal'))
app.use('/api/faq', require('./route/faq'))
app.use('/api/feedback', require('./route/feedback'))
app.use('/api/membership', require('./route/membership'))
app.use('/api/newsletter', require('./route/newsletter'))
app.use('/api/otp', require('./route/otp'))
app.use('/api/ticket', require('./route/ticket'))

// assets route
// app.use('/api/assets/', require('./route/media'))
// app.use('/api/web', require('./route/webdata'))

mongoose.connect(process.env.MONGO_URL, () => {
  console.log("Database connected")
})


app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT} `)
})


// const twilio = require("twilio");
// const Api = require("twilio/lib/rest/Api");
// const client = twilio(
//   process.env.TWILIO_SID,
//   process.env.TWILIO_TOKEN
// );

// function sendSMS(from, to, body) {
//   client.messages
//     .create({ from, to, body })
//     .then((message) => {
//       console.log(
//         `SMS message sent from ${from} to ${to}. Message SID: ${message.sid}`
//       );
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// }

// sendSMS(
//   process.env.TWILIO_PHONE,
//   process.env.TO_PHONE_NUMBER,
//   "This is an SMS notification!"
// );

// app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
// const port = 8001 || process.env.PORT;
// app.use("/public", express.static(__dirname + "/public"));

// const nodemailer = require("nodemailer");
// app.get("/", async (req, res)=>{
//     // res.status(200).send(`"Response":"my first Api"`)
//     try {
//         var transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//               user: process.env.SMTP_USER,
//               pass: process.env.SMTP_PASS
//             }
//           });
//           var mailOptions = {
//             from: process.env.SMTP_USER,
//             to: 'udayveerchauhan1414@gmail.com',
//             subject: 'Hello',
//             text: 'uvyuibuh',
//           };
//           transporter.sendMail(mailOptions, function (error, info) {
//             if (error) {
//               console.log(error);
//             } else {
//               console.log(info.response);
//             }
//          });

//     } catch (error) {
//         res.send(error)
//     }
//     console.log(process.env.SMTP_USER)
    
// })