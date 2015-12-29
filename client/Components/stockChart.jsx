
import React from 'react';
import ReactDOM from 'react-dom';
import c3 from 'c3';
import request from 'superagent';
import $ from 'jquery';

export const StockChart = React.createClass ({

  componentWillMount () {
    
    let close = [];
    let xAxis = [];
    let that = this;
    $.ajax({
        type: "GET",
        headers: {"Access-Control-Allow-Origin": "*",
                  'Content-Type':'text/plain'},
        url:'http://localhost:8080/stocks/history/'+this.props.symbol
    }).done(function (data) {
        console.log(data)
        //make array of close data in order of dates
        //loop through the dates 
        for (var i = 0; i < data.dates.length; i++) {
          close.push(data.data[data.dates[i]])
        }
        close.unshift('close')

        console.log('close', close);
        //make the array of dates have x at start for c3
        xAxis = data.dates;
        xAxis.unshift('x');

        that.buildChart(close, xAxis);
    });

  },

  buildChart(close, xAxis) {
    console.log('in build',close, xAxis);
    c3.generate({
      bindto: ReactDOM.findDOMNode(this.refs.chart),
      data: {
        x: 'x',
        columns: [
          xAxis,
          close
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