//import React, {useState, useEffect, Component,} from 'react';
import React, {Component} from 'react';
import './App.css';
//import DatePicker from 'react-datepicker';
//import 'react-datepicker/dist/react-datepicker.css';
import Web3 from 'web3';
import Footer from './Footer';
//import Offerlist from './OfferList';
//import Footer from './Footer';



class Body extends Component {

  render(){
    return(
      <div className="body">
        <div className="matchOffer">
          <h1 className="placeofferTitle">Match Offer</h1>
            <table className="table">
              <thead >
                <tr>
                  <th>No</th>
                  <th>Creator</th>
                  <th>Exchange</th>
                  <th>To Receive</th>
                  <th>Expiry Date</th>
                  <th>Execution Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="offerList">
                {
                this.props.offers.map((offer, key)=>{
                  return(
                    !offer.matched
                    ?<tr key = {key}>
                    <th >{offer.id.toString()}</th>
                    <td>{offer.owner.substring(0,7)}</td>

                      <td>{window.web3.utils.fromWei(offer.amount1.toString(), 'Ether')}
                          {offer.token1}</td>
                      <td>{window.web3.utils.fromWei(offer.amount2.toString(), "Ether")}
                          {offer.token2}</td>
                      <td>{(new Date(offer.expiryDate * 1000).getDate())+'/'+
                            (new Date(offer.expiryDate * 1000).getMonth()+1)+'/'+
                            (new Date(offer.expiryDate * 1000).getFullYear())
                            }</td>
                      <td>{(new Date(offer.executionDate * 1000).getDate())+'/'+
                            (new Date(offer.executionDate * 1000).getMonth()+1)+'/'+
                            (new Date(offer.executionDate * 1000).getFullYear())
                            }</td>
                      <td>

                          <button className ="matchButton"
                          name = {offer.id}
                          value = {offer.amount2}


                          onClick={(event)=>{
                            const token = offer.token2

                            this.props.matchOffer(event.target.name, event.target.value, token)
                          }}>
                            Match
                          </button>

                      </td>
                  </tr>
                 : null
                  )
                })
               }
              </tbody>
            </table>
        </div>

        <div className="placeOffer" id="content">
          <h1 className="placeofferTitle">Place Offer</h1>
          <form onSubmit={(event) => {
            event.preventDefault()
            const amount1 = window.web3.utils.toWei(this.exchangeValue.value.toString(), "Ether")
            const token1 = this.exchangeToken.value

            const amount2 = window.web3.utils.toWei(this.receiveValue.value.toString(), "Ether")
            const token2 = this.receiveToken.value

            var date1 = new Date(this.expirydate.value)
            const expiryDate = date1.getTime() /1000

            var date2 = new Date(this.executiondate.value)
            const executionDate =  date2.getTime() /1000

            this.props.createOffer(amount1, token1, amount2, token2, expiryDate,executionDate)

          }}>

            <div className="input">
            Amount to Exchange:
              <div>
                <input
                  id="exchangeValue"
                  type="text"
                  ref={(input) => { this.exchangeValue = input }}
                  placeholder="0.0"
                  required />
                <input
                  id="exchangeToken"
                  type="text"
                  ref={(input) => { this.exchangeToken = input }}
                  placeholder="ETH"
                  required />
              </div>
            </div>

            <div className="input">
            Amount to Receive:
              <div>
                <input
                  id="receiveValue"
                  type="text"
                  ref={(input) => { this.receiveValue = input }}
                  placeholder="0.0"
                  required />
                <input
                  id="receiveToken"
                  type="text"
                  ref={(input) => { this.receiveToken = input }}
                  placeholder="DAI"
                  required />
              </div>
            </div>

            <div className="input">
            Expiry Date:
              <input
                id="expiryDate"
                type="date"
                ref={(input) => { this.expirydate = input }}
                placeholdertext="Select a date from Today"
                dateformat= 'dd/MM/yyyy'
                required />
            </div>

            <div className="input">
            Execution Date:
              <input
                id="executeDate"
                type="date"
                ref={(input) => { this.executiondate = input }}
                placeholdertext="Select a date from Today"
                dateformat= 'dd/MM/yyyy'
                required />
            </div>
            <button type="submit" className="submitOffer" >Submit</button>
          </form>
        </div>
    </div>
    )
  }

}

export default Body; 
