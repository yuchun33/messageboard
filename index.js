const express = require('express')
const app = express()
const port = 3001
const bodyParser = require('body-parser')
const loginController = require('./controllers/loginController')
const registerController = require('./controllers/registerController')
const commentsController = require('./controllers/commentsController')
const db = require('./models/dbhandlers')
const dbinfo = require('./dbinfo.js')


let options = {
    host: dbinfo.host,
    user: dbinfo.username,
    password: dbinfo.password,
    database: dbinfo.database,
    port: 3306,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 100000
      }
}

const session = require('express-session');
const SessionStore = require('express-mysql-session')
const sessionStore = new SessionStore(options);

app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: sessionStore,
    schema:{
        tableName: 'yuchun33_sessions'
    }
}))

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: false}))//????
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))

//Routes
app.get('/', loginController.loginPage)
app.post('/login', loginController.loginHandler)
app.get('/register', registerController.registerPage)
app.post('/register', registerController.registerHandler)
app.get('/comments/:page',(req, res)=>{
    db.getComments(req, res).then((dbresult)=>{
        res.render('main',{user: req.session.nickname||'', result: dbresult, page:req.params.page})
    })
})
app.get('/comments',(req, res)=>{
    db.getComments(req, res).then((dbresult)=>{
        res.render('main',{user: req.session.nickname||'', result: dbresult, page:'1'})
    })
})
app.post('/createComment', commentsController.createComments)
app.post('/updateComment', commentsController.updateComments)
app.get('/deleteComment', commentsController.deleteComments)
app.post('/deleteComment', commentsController.deleteComments)
app.get('/logout', loginController.logoutHandler)
app.listen(port)