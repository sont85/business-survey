'use strict';
var express = require('express');
var flash = require('express-flash');
var router = express.Router();

var mongoose = require('mongoose');
var parameterize = require('parameterize');

var db = mongoose.connection;

db.on('error', console.error);
db.once('open', function() {
  // Create your schemas and models here.
});

mongoose.connect('mongodb://sont85:123@ds061701.mongolab.com:61701/son');

var ideaSchema = new mongoose.Schema({
  email: String,
  name: String,
  group: String,
  problem: String,
  solution: String,
  cost: String,
  code: String,
  answers: []
});

var Idea = mongoose.model('Idea', ideaSchema);

router.get('/', function(req, res) {
  res.render('index', { });
});

router.post('/hypothesis', function(req, res) {

  var titleCode = parameterize(req.body.name || req.body.group).substring(0,42);
  var idea = new Idea({
    email: req.body.email,
    name: req.body.name,
    group: req.body.group,
    problem: req.body.problem,
    why: req.body.why,
    solution: req.body.solution,
    cost: req.body.cost,
    code: ((new Date()).getTime()).toString() + "-" + titleCode
  });

  idea.save(function(err, idea) {
    if (err) {
      req.flash('danger', 'There was a problem');
      return console.error(err);
    }
    req.flash('success', 'Hypothesis saved');
    res.redirect('/hypothesis/' + idea.code);
  });

});

router.get('/hypothesis/:code', function(req, res) {
  Idea.findOne({ code: req.params.code }, function(err, idea) {
    if (err) {
      return console.error(err);
    }
    if (idea) {
      res.render('idea', { idea: idea });
    } else {
      res.redirect('/?i');
    }
  });
});


router.get('/getQuestion/:code', function(req, res) {
  Idea.findOne({ code: req.params.code }, function(err, idea) {
    if (err) {
      return console.error(err);
    }
    if (idea) {
      res.json(idea);
    }
  });
});
router.post('/submitAnswer/:code', function(req, res) {
  console.log(req);
  Idea.findOne({ code: req.params.code }, function(err, idea) {
    if (err) {
      return console.error(err);
    }
    if (idea) {
      idea.answers.push(req.body);
      idea.save();
      res.send('success');
    }
    res.status(404);
  });
});

module.exports = router;
