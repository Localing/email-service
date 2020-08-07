require('dotenv').config();

module.exports = {
    'aws': {
        'key': process.env.AWS_SES_ACCESS_KEY_ID,
        'secret': process.env.AWS_SES_SECRET_ACCESS_KEY,
        'ses': {
            'from': {
                'default': '"Localing" <no-reply@localing.co.uk>', 
            },
            'region': process.env.AWS_SES_REGION
        }
    }
};