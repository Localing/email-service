const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const sesClient = require('./ses-client');
const Email = require('email-templates');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("Email service is up.")
});

// order verification email to be sent to customers
app.post('/orders/customer', (req, res) => {
    const email = new Email();
    email.render('orders/customer/html', {
        customerName: req.body.customerName,
        orderCode: req.body.orderCode,
        businessName: req.body.businessName,
        businessAddress: req.body.businessAddress,
        businessPhone: req.body.businessPhone,
        items: req.body.items
    }).then((html) => {
        sesClient.sendEmail(req.body.recipientEmail, `Your order from Localing (#${req.body.orderCode})`, html);
        res.send('Email sent');
    });
});

app.listen(3000, () => {
    console.log('Email service is listening on port 3000');
});