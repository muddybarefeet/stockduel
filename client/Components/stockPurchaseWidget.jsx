'use strict';

import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { toJS } from 'immutable';

const RaisedButton = require('material-ui/lib/raised-button');
const TextField = require('material-ui/lib/text-field');

export const StockPurchase = React.createClass({

  render() {
    const { buy, MatchId, userId, stockTicker } = this.props;
    let numShares;
    return (
      <div className="purchaseContainer">
         <TextField hintText="Number of Stocks" ref="numSharesInput" onChange={ function () {
          numShares = arguments[0].target.value;
         }} />

         <RaisedButton 
          label="Buy"
          onClick={() => {
           let buyOptions = {
              numShares: parseInt(numShares, 10),
              stockTicker: stockTicker.toUpperCase(),
              MatchId: MatchId,
              userId: userId,
              action: 'buy'
            };
            this.refs.numSharesInput.refs.input.value = "";
            buy(buyOptions);
            window.location.hash="#/portfolio";
          }
        }/>

      </div>
    );
  }

});