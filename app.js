
// packages
const express = require('express');
const app = express();
const bp = require("body-parser");
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session);
const pool = require('./util/database'); // Import the existing database connection
const flash = require('connect-flash')
const csrf = require('csurf');
const nodemailer = require('nodemailer')
const sendGridTransport = require('nodemailer-sendgrid-transport')
// packages

//email



// Use the pool connection in MySQLStore
const sessionStore = new MySQLStore({}, pool);


// routes 
const adminsRoutes = require('./routes/admin/routes');
const usersRoutes = require('./routes/user/routes');
// routes 

app.use(bp.urlencoded({ extended: true })); // before any middleware , cause this is for all middlewares


// template engine
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', 'view');
// template engine





//middlewares

function getSessionExpiration() {
    const now = new Date();
    now.setHours(now.getHours() + 3, now.getMinutes() + 30); // Adjust to UTC+3:30
    const expiration = new Date(now.getTime() + 1000 * 60 * 60 * 2); // 2 hours from adjusted time
    return expiration - Date.now(); // Return the milliseconds remaining
}

const csrfProtection = csrf()
app.use(express.urlencoded({ extended: true }));


app.use(session({
    store: sessionStore,
    name: 'sessionId',
    secret: 'acknowledge-me',
    resave: false,
    saveUninitialized: false,
    rolling: false,  // Don't reset expiration on each request
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: getSessionExpiration()
    }
}));


// اعمال حفاظت CSRF به روی تمامی مسیرها
app.use(csrfProtection);

app.use((req, res, next) => {
    res.locals.isAuth = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})
app.use(flash())
app.use(adminsRoutes)
app.use(usersRoutes)


app.use('/', (req, res) => {
    res.send("NOT FOUND")
})
//middlewares


console.log("Running");
app.listen(3000);