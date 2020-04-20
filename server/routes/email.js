const express = require('express');
const bodyParser = require('body-parser');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion')
const app = express();

const nodemailer = require('nodemailer');
//app.use(express.urlencoded({extended: false}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/email', async (req, res) => {
    const { name, email, phone, message } = req.body;

    let body = req.body;
    console.log(body);
    contentHTML = `
<h1>User Information</h1>
<ul>
<li>Username: ${name}</li>
<li>User email: ${email}</li>
<li>User email: ${phone}</li>
</ul>
<p>${message}</p>
`;

const transporter = nodemailer.createTransport({
    host: 'mail.diegodavidochoa.co',
    port: 465,
    auth: {
        user: 'alertplanet@diegodavidochoa.co',
        pass: 'Alanemiliano123*'
    },
    tls:{
        rejectUnauthorized: false
    }


   /* 
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'eino96@ethereal.email',
        pass: 'uGkMbSvdFpQzZub57d'
    },
    tls:{
        rejectUnauthorized: false
    }
    */
});



const info = await transporter.sendMail({
from: "'Alert Planet'  <alertplanet@diegodavidochoa.co>",
to: ['edwalejo21@hotmail.com','webeao@gmail.com'],
subject: 'Contaco Alert Planet',
html: contentHTML
});

console.log('Message sent', info.messageId);
   
//res.redirect('/success.html');
res.json({
    ok: true,
    informacion: info.messageId
  

})
});

module.exports = app;