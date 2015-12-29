var express = require('express');
var router = express.Router();
var stocksController = require('../db/dbcontrollers/stocksController');
var request = require('request');
var utils = require('./utils');
var rp = require('request-promise');

module.exports = function (knex) {
  stocksController = stocksController(knex);

  router.param('symbol', function (req, res, next, symbol) {
    req.symbol = symbol;
    next();
  });

  router.route('/')
    .get(function (req, res) {
      var search = req.query.search;
      stocksController.searchStock(search)
        .then(function (response) {
          res.json({
            data: response
          });
        });
    });

  router.route('/update')
    .post(function (req, res) {
      var list = req.body;
      stocksController.updatePrices(list)
        .then(function (stockArray) {
          res.status(200).json({
            data: stockArray
          });
        })
        .catch(function (err) {
          res.status(400).json({
            message: err
          });
        });
    });

  router.route('/:symbol')
    .get(function (req, res) {
      var symbol = req.symbol;
      stocksController.getStock(symbol).then(function (response) {
        if (response === null) {
          res.sendStatus(404);
        } else {
          res.json({
            data: response
          });
        }
      });
    });

  router.route('/history/:symbol')
    .get(function (req, res) {
      var stockSymbol = req.params.symbol;
      var dateNow;
      var dateWeekBefore;
      dateNow = Date.now();
      if (!dateWeekBefore) {
        //change dateWeekBefore to look at the start date of the match for the moment use this
        dateWeekBefore = dateNow - 604800000;
      }
      //make variables for the current date
      var yearNow = new Date(dateNow).getFullYear();
      var monthNow = new Date(dateNow).getMonth();
      var dayNow = new Date(dateNow).getDate();
      //variables for the start date
      var yearStart = new Date(dateWeekBefore).getFullYear();
      var monthStart = new Date(dateWeekBefore).getMonth();
      var dayStart = new Date(dateWeekBefore).getDate();

      //USE REQUEST PROMISE LIBRARY HERE
      var url = 'http://ichart.yahoo.com/table.csv?s='+stockSymbol+'&a='+monthStart+'&b='+dayStart+'&c='+yearStart+'&d='+monthNow+'&e='+dayNow+'&f='+yearNow+'&g=d';
      
      rp(url)
        .then(function (body) {

          var data = {};
          var dates = [];

          var returnObj = {};
          var jsonForm = utils.csvJSON(body);
          jsonForm = JSON.parse(jsonForm);

          //make array of objects of closes and dates
          jsonForm.forEach(function (row) {
            for (var key in row) {
              if (row.Date.length !== 0 && row.Close.length !== 0) {
                var date1 = row.Date;
                data[date1] = Math.round(row.Close);
              }
            }
          });

          //make array of dates
          jsonForm.forEach(function (row) {
            for (var key in row) {
              if (dates.indexOf(row.Date) === -1 && row.Date.length !== 0) {
                dates.push(row.Date);
              }
            }
          });

          returnObj.data = data;
          //reverse date array so earliest date is at the start
          returnObj.dates = dates.reverse();

          res.status(200)
          .send(returnObj);

        })
        .catch(function (err) {
          console.log('err in get stock info', err);
          res.sendStatus(400);
        });

      });

  return router;

};