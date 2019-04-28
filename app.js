var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var admin = require("firebase-admin");

var patienceRouter = require('./routes/patience');
var patienceRequestRouter = require('./routes/patience-request');
var nurseRouter = require('./routes/nurse');

var firebase = require("firebase-admin");

var config = {
    "type": "service_account",
    "project_id": "sadna-f81ce",
    "private_key_id": "67b69265b63a56a11ea254266aa0b108660c1196",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCpIgbffklVnKHr\nMRxfvhwie5+oK8+Z2thFViEXkehcyjxO4/BeHRvIMs5ST726MeTkQkzEvj3wJabd\n8V35MT50O8W8yVoVvhIj/MWERUm/SOKnPkzonPPoaU5eaWT/AZ9YD6WAkXwttBse\n+oXKHuDe5FLQkcOy502V9pQqr9juQkFrEbiAVF2qICqz1UXP8l0H+iJ9A2tmX6+N\nmwgMGUMxj14Fz5DhcWyFEEA7P+sxVCtDtg7CIsQEmQruvH001/Ce/0hlGqoklAuh\nJM4YLMzf/zJ7nQ7oOCCOC6+V1/Dklv/qIGcgAbABzUk/2GxBa1yQuW5imMtkN2cB\nAatCEtsHAgMBAAECggEAPpnCk3xJpm9oGwY9a06RWU4KhRNaLqcqv1cmvnOZ3qZX\n9hc2A4+gldQAO8UaA02uW7ISegu0HyvAfIt27eIFLL5m7P5V4pBMZJeNf+ypZCyU\n/7P2gW5+dLptcFJwOFagZNa9uj2fCceM9kVhubL+JmG6KUqadaBZPjVbGAWoNF8l\ndPkORaFlxBZm1fEWCINNatBojq2+9wVDpDGRRZ8Hoc9Hj+Ox9hlmOf8b7B5Rq8CM\nP1x2yvh2gfx9NL8mz967ak/np2LIdJJuEwXe5SpxCdYbTDczYRlrqGuLR/Ng/nJ5\ntHTLt2M15pBGWgFar16xLHmiBNL613++Y++U34f+iQKBgQDX+8Ynp+U4TBKI2AzM\nfRtiGUW0Qtn6rdTHUjTHKRJMQ73givKyxuKl9bXAhTt7PU3TLrxpU+bsneXgN/dV\nytt3SE2gVBmwdCNznfATXOHOju009d2Y88d/XAzM8Pg3XhjvoWEF4+1N05cEhuvJ\nr/bE6OxZKq9EjiOL3eZ89Vr4CwKBgQDIeBohQSFBfN4/RfFxh1c1NV+5GAno5dYj\nHdjUX0WuqMRF5xERSofkJfNb3k8C/GmiAuDy9AJZwVL6k4RkDhmxrHBkoCC7o/on\nY8MOjxSDZ+gnevpYCDWFbijvKn9RUgZ3zkGvGP1PaG9FBoSW/mWXBT7FrmXqZPUS\neSvpEQc6dQKBgQCfWhp0LbK4G6BdKJIg2Xk3oo/EFMLA6jogKW3ZN1tRu3U/UyUH\ndCfK7IOBnIsrPSrLUiMezxGEqGbvTDuHJ9lOo6DqVsJxZu61IeT8VD4h6V/oADLT\n46DgPakQGAX6y8k4G+f6sZTnI+K7K1SSBOrbk0K18wFHYlulmT2yGlBYywKBgQCp\nGn7YPGuEJYQIlcSUwtjynmJv7XI2juJy3vOQOgm6ysw+NytzjY5SCx1dCotV9nxY\n2NrOtrzg365Sh2uvRyGvecmZaGYUQr96yLG6r0Fbk6QG4bsZ1VrogkNvdEbP30Rr\nfYZ04LyVZoAuFtBz2obxvM/1yyZXcfA1NBexU9boHQKBgA3ioTd9fRyq9a73II/F\nsPF1x9hKMQ0H80BlWWWywDIR1++myKe7QfWsFB5Qli9MDqX6yFfroWTzX9u10VV3\ncE5i6ZkJJBeAaemYL5PZKvYGkAQRRKz2XlM+uk594CkvOJX9NVVrzhQ/9CF3gJu8\nrlY9xv24Sr+lVnqiizRym7xo\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-hsugc@sadna-f81ce.iam.gserviceaccount.com",
    "client_id": "109836783597752924913",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-hsugc%40sadna-f81ce.iam.gserviceaccount.com"

};

firebase.initializeApp({
    credential: admin.credential.cert(config),
    databaseURL: 'https://sadna-f81ce.firebaseio.com/'
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/patience', patienceRouter);
app.use('/patience-request', patienceRequestRouter);
app.use('/nurse', nurseRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = {
    app
};
