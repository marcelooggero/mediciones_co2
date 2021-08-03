const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const globalErrorHandler = require('./controllers/errorController');

const measureRouter = require('./routes/measureRouter');



// const viewRouter = require('./routes/viewRoutes');
// const orderRouter = require('./routes/orderRoutes');
const AppError = require('./utils/appError');

const app = express();

app.enable('trust proxy');

// app.set('view engine', 'pug');
// app.set('views', path.join(__dirname, 'views'));

// 1) GLOBAL MIDDLEWARE
// Implement cors
app.use(cors()); //Access-Control-Allow-Origin permite a otros consumir nuestra api
// app.use(cors({credentials: true, origin: 'http://localhost:3001'}));
app.options('*', cors());

// SERVING STATIC FILES
app.use(express.static(path.join(__dirname, 'public')));
// SET SECURITY HTTP HEADERS
app.use(
  helmet({
    contentSecurityPolicy: false
  })
);
// DEVELOPMENT LOGGING
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// LIMIT REQUEST FROM SAME IP
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: 'Too many request from this IP, try again in an hour!'
// });
// app.use('/api', limiter);

// BODY PARSER, READING DATA FROM BODY INTO req.body
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// DATA SANITIZATION AGAINS NOSQL QUERY INJECTION
app.use(mongoSanitize());

// DATA SANITIZATION AGAINST XSS
app.use(xss());

// PREVENT PARAMETER POLLUTION
app.use(
  hpp({
    whitelist: ['price', 'role']
  })
);

//Ejemplo de un middleware
// app.use((req, res, next) => {
//   console.log('Hello middleware  🤗');
//   next();
// });

app.use(compression());

// TEST MIDDLEWARE
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// 3) ROUTES
// app.use('/', viewRouter);
app.use('/api/v1/medicion', measureRouter);


app.all('*', (req, res, next) => {
  // const err = new Error(`Cant't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;
  next(new AppError(`Cant't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
