var express = require('express');
var router = express.Router();
var Account = require('../models/account');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});
var express = require('express');
var router = express.Router();
var Account = require('../models/account');
var Event = require('../models/event');
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.get('/details', function (req, res) {
    if (req.user) {
        Account.findOne({email: req.user.email},
            function (err, user) {
                if (err) {
                    res.render('error', {message: err.message, error: err});
                }
                else
                {

               /* Event.find({participants: req.user._id},
                    function(err,event){
                         if (err) {
                    res.render('error', {message: err.message, error: err});
                    }
                    else
                    {
                        event.
                    }

                    });
                    
                function(err,event){
                    if (err) {
                    res.render('error', {message: err.message, error: err});
                    }
                    
                    event.
                } */   
                res.render('details', {user: user});
                }

            });
    } 
    else {
        res.render('error', {message: 'Please login', error: {status: '', stack: ''}});
    }

});


router.post('/details', function (req, res) {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var phone_no = req.body.phone_no;
    Account.findOne({email: req.user.email},
        function (err, user) {
            if(err) {
                res.render('error', {message: err.message, error: err});
            }
            user.phone_no = phone_no;
            user.is_new = false;
            user.dob = req.body.dob;
            user.college = req.body.college;
            user.course = req.body.course;
            user.year = req.body.year;
            user.save(function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    res.render('details', {user: data, edit: 'success'})
                }
            });
        });
});

module.exports = router;
