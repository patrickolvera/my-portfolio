(() => {
const express = require('express'),
      path = require('path'),
      nodeMailer = require('nodemailer'),
      bodyParser = require('body-parser');

  const app = express();
  app.set('view engine', 'ejs');
  app.use(express.static('public'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  const port = process.env.port || 3000;

  // When root route is requested render index.ejs
  app.get('/', function (req, res) {
    res.render('index');
  });

  // When /contact route is requested compose and send email
  app.post('/contact', function (req, res) {
    let transporter = nodeMailer.createTransport({
      host: 'server224.web-hosting.com',
      port: 465,
      secure: true,
      auth: {
        user: 'me@patrickolvera.com',
        pass: 'F=IAhx?J=Ff='
      },
      // Allows sending emails from localhost (remove in production)
      tls: {
        rejectUnauthorized: false
      }
    });
    let mailOptions = {
      from: req.body.email, // sender address
      to: 'me@patrickolvera.com', // list of receivers
      subject: `Portfolio Message`, // Subject line
      html: 
        `<h4>Name: ${req.body.name}:</h4>
        <h4>Email: ${req.body.email}</h4>
        <h4>Message: </h4>
        <p>${req.body.message}</p>`, // html
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
      // Redirect to root route to prevent refreshes resending POST
      res.redirect('/');
      });
    });

    app.listen(port, function(){
      console.log(`Server is running at: http://localhost:${port}`);
    });
  })();