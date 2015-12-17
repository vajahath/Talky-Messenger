var express = require('express');
var router = express.Router();
var session = require('express-session');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var base=10;
var usrUpdate={
    n:0,
    nam:'',
    leftUsr:'', //used only when a user leaves
    joined:0 //if joined- 1, left -0
};


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret:'I am in a relationship with someone.'}));
app.use(express.static('public'));


app.get('/', function(req, res)
{
    console.log("in /");
    req.session.destroy(function(err)
    {
        if(err)
        {
            console.log("session NOT cleared...!*************************** err:", err);
            res.redirect('/me'); //something went wrong!
        }
        else
        {
            console.log("session cleared...! no err, sign up");

            res.render('./hi_who.ejs', {
                "title":"Talky | so u r here!",
                "n":usrUpdate.n
            });
        }
    });
})

app.post('/', function(req, res)
{
    if(req.body.name==("server"||"Server"||"SERVER"))
    {
        //server auth:
        req.session.usr={
            id:-10,
            name:"server"
        };
        res.redirect('/serveAuth');
    }
    else if(req.body.name)
    {
        console.log(req.body.name);
        req.session.usr={
            id:base++,
            name:req.body.name
        };
        res.redirect('/me');
        //console.log(req.session.usr.name+"  "+req.session.usr.id);
    }
    else
    {
        res.redirect('/');
    }
});

app.get('/serveAuth', function(req, res)
{
    if((req.session.usr.id==-10)&&(req.session.usr.name=="server"))
    {
        res.render('who.ejs',{err:"", cls:""});
    }
});

app.post('/serveAuth', function(req, res)
{
    if((req.session.usr.id==-10)&&(req.session.usr.name=="server"))
    {
        if((req.body.psw=="lovemelikeudo")&&(req.body.message))
        {
            //correct
            io.emit('serverMsg', req.body.message);
            console.log(req.body.message);
            res.send("<!DOCTYPE html><html><head><title>Message Broadcasted</title><style type=\"text/css\">.err{padding: 3px;color: #FFF;background-color: green;display: inline-block;}</style></head><body><p class=\"err\">Message Broadcasted</p></body>");
        }
        else
        {
            console.log("admin login failed");
            res.render('who.ejs', {err:"password incorrect", cls:"err"});
        }
    }
});

app.get('/me', function(req, res)
{
    if(!req.session.usr)
        res.redirect('/');
    else
    {
        res.render('chatTheme.ejs', {
            title:"Talky | "+req.session.usr.name,
            name:req.session.usr.name,
            id:req.session.usr.id
        });
        usrUpdate.nam=req.session.usr.name;
    }
});

io.on('connection', function(socket)
{
    usrUpdate.n++;
    usrUpdate.joined=1;

    socket.nam=usrUpdate.nam;
    
    console.log('a user connected:'+usrUpdate.n+" "+usrUpdate.nam);
    io.emit('usrUpdate', usrUpdate);

    socket.on('chat message', function(msg1)
    {
        //console.log('message: ' + msg1.chat);
        // var t=msg1.tim;
        // msg1.tim.getHours()+":"+msg1.tim.getMinutes();
        // console.log("time : "+msg1.tim);
        io.emit('chat message', msg1);
    });

    setTimeout(function()
    {
        socket.on('typ', function(n)
        {
            io.emit('typing', n);
            // console.log("timeout start");
            setTimeout(function()
            {
                // console.log("timeout start");
                io.emit('clrtyp');
            }, 2000);
        });
    }, 4000); 

    socket.on('disconnect', function()
    {
        usrUpdate.n--;
        usrUpdate.joined=0;
        usrUpdate.leftUsr=socket.nam;
        console.log('user disconnected:'+usrUpdate.n+' socketNam:'+socket.nam);
        io.emit('usrUpdate', usrUpdate);
    });
});

//io.on('connection', function(socket){
//    console.log('a user connected');
//});

http.listen(3000, function()
{
    console.log('listening on *:3000');
});

app.get('/test', function(req, res)
{
    res.render('hi_who.ejs');
});

module.exports = router;
