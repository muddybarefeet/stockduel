
import React from 'react';
import ReactDOM from 'react-dom';
import c3 from 'c3';
import request from 'superagent';
import $ from 'jquery';

export const StockChart = React.createClass ({

  componentWillMount () {

    //variable for the current date
    let dateNow;
    let dateWeekBefore;
    dateNow = Date.now();
    if (!dateWeekBefore) {
      //change dateWeekBefore to look at the start date of the match for the moment use this
      dateWeekBefore = dateNow - 604800000;
    }
    //make variables for the current date
    let yearNow = new Date(dateNow).getFullYear();
    let monthNow = new Date(dateNow).getMonth();
    let dayNow = new Date(dateNow).getDate();
    //variables for the start date
    let yearStart = new Date(dateWeekBefore).getFullYear();
    let monthStart = new Date(dateWeekBefore).getMonth();
    let dayStart = new Date(dateWeekBefore).getDate();

    $.ajax({
        type: "GET",
        headers: {"Access-Control-Allow-Origin": "*",
                  'Content-Type':'text/plain'},
        url:'http://localhost:8080/stocks/history/'+this.props.symbol
    }).done(function (data) {
        console.log(data)
    });
    
  },

  componentDidMount(){
    this.buildChart(this.props.stocks);
  },

  buildChart(stocks) {
    c3.generate({
      bindto: ReactDOM.findDOMNode(this.refs.chart),
      data: {
        x: 'x',
        columns: [
          ['x', '2013-01-01', '2013-01-02', '2013-01-03', '2013-01-04', '2013-01-05', '2013-01-06'],
          ['close', 30, 200, 100, 400, 150, 250]
        ]
      },
      axis: {
        y: {
          label: {
            text: 'Close in $',
            position: 'outer-middle'
          }
        },
        x: {
          type: 'timeseries',
          tick: {
            format: '%Y-%m-%d'
          },
          label: {
            text: 'Date',
            position: 'outer-middle'
          }
        }
      }
    });
  },
  
  render(){
    return (
      <div ref="chart" className="c3Line" ></div>
    )
  }
});