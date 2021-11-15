var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
var flash = require('connect-flash');


const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
//nếu chưa tải về thì tải gói session với lệnh
//npm install express-session
const session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


var app = express();
app.listen(3000, () => {
    console.log('server loading...')
})
app.use(require('body-parser').urlencoded({ extended: false }));
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type', 'Content-Type: application/json; charset=UTF-8');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
});



const url = 'mongodb+srv://vuvantinh:Tv170203@cluster0.0kodl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err) {
    if (err) throw err;
    console.log('Kết nối database thành công');
});
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
app.use(session({
    cookie: { maxAge: 60000 },
    secret: 'vuvantinh',
    resave: false,
    saveUninitialized: false
}));
// view engine setup

app.set('views', path.join(__dirname, 'views'));

//và khai báo sử dụng:
app.use(session({
    secret: 'something',
    cookie: {
        maxAge: 1000 * 50 * 50033 //đơn vị là milisecond
    },
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

app.set('view engine', 'ejs');
// app.use(passport.initialize()); //Dòng này để thông báo sử dụng passport nhé

app.use(logger('dev'));
app.use(express.json({ inflate: false }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './public')));
app.use(express.json());
app.use('/', indexRouter);
app.use('/users', usersRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
// passport.use(new localStrategy(
//     (username, password, done) => { //các tên - name trường cần nhập, đủ tên trường thì Done 
//         if (username1 == 'user') { //kiểm tra giá trị trường có name là username
//             if (password == '12345') { // kiểm tra giá trị trường có name là password
//                 return done(null, username); //trả về username
//             } else {
//                 return done(null, false); // chứng thực lỗi
//             }
//         } else {
//             return done(null, false); //chứng thực lỗi
//         }
//     }
// ))
// passport.serializeUser((username, done) => {
//     done(null, username);
// })
// passport.deserializeUser((name, done) => {
//     //tại đây hứng dữ liệu để đối chiếu
//     if (name == 'user') { //tìm xem có dữ liệu trong kho đối chiếu không
//         return done(null, name)
//     } else {
//         return done(null, false)
//     }
// });
app.get('/a', function(req, res) {
    res.send('ok')
})

module.exports = app;