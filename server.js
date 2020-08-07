const express = require('express');
const bodyParser = require('body-parser');
const Joi = require('joi');
const app = express();
const validator = require('express-joi-validation').createValidator({});

const sesClient = require('./ses-client');
const Email = require('email-templates');

var dateFormat = require('dateformat');
var now = new Date();
const formattedDate = dateFormat(now, "d mmmm yyyy");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("Email service is up.")
});

const customerOrderEmailSchema = Joi.object({
    recipientEmail: Joi.string().email().required(),
    customerName: Joi.string().required(),
    orderCode: Joi.string().required(),
    businessName: Joi.string().required(),
    businessAddress: Joi.string().required(),
    businessPhone: Joi.string().required(),
    items: Joi.array().items({
        name: Joi.string().required(),
        quantity: Joi.number().required()
    })
})

// order verification email to be sent to customers
app.post('/orders/customer', validator.body(customerOrderEmailSchema), (req, res) => {
    const email = new Email();
    email.render('orders/customer/html', {...req.body, formattedDate})
    .then((html) => {
        sesClient.sendEmail(req.body.recipientEmail, `Your order from ${req.body.businessName} (#${req.body.orderCode})`, html);
        res.send('Email sent');
    });
});

app.listen(3000, () => {
    console.log('Email service is listening on port 3000');
});