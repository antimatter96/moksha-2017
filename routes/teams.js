var express = require('express');
var Event = require('../models/event');
var router = express.Router();
var Account = require('../models/account');
var Team = require('../models/team');
var userLogic = require('../logic/userLogic');

router.get('/myTeams', userLogic.ensureAuthenticated, function(req, res) {

    Team.find({members: req.user._id}).lean().exec(function(err, teams) {
        if(err)
            res.render('error', {message:"Sorry!", error: err});
        else
            res.render('team', { teams: teams});
    })


});

router.get('/newTeam', userLogic.ensureAuthenticated, function(req, res) {
    res.render('addTeam', {user: {inno_id: req.user.inno_id}});
});

router.post('/newTeam', userLogic.ensureAuthenticated, function(req, res) {

    var count=req.body.category;
    count--;
    var inno = [];
    if(count){
    var id2 = req.body.mem2;
        count--;
        inno.push(id2);
    }
    if(count){
    var id3 = req.body.mem3;
        count--;
        inno.push(id3);
    }
    if(count){
    var id4 = req.body.mem4;
        count--;
        inno.push(id4);
    }
    if(count){
    var id5 = req.body.mem5;
        inno.push(id5);
    }
    console.log(inno);
    var id1 = req.user.inno_id;
    var tname = req.body.name;

    var captain = req.user._id;

    var mem = [];

    Account.find({inno_id:{ $in: inno }},function(err, users) {
        console.log("in");
       if (err) {
            console.log(err);
            res.render('errorTeam');
        } 
        else
        {
            if(users)
            {
                console.log(users);
                mem.push(captain);
                for(var i=0;i<users.length;i++)
                {
                    console.log(users[i]._id);
                    mem.push(users[i]._id);
                    console.log("mem is");
                    console.log(mem);
                }

                team = new Team({
                name: tname,
                members: mem,
                captain: captain
                });

                team.save(function (err, Team) {
                    if(err) {
                        console.log(err);
                        res.render('errorTeam');
                    }
                    else {
                        res.render('teamAdded', {team: Team});
                    }

                });
            }
        }
    });
});
    
module.exports = router;
