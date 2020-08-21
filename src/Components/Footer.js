import React, {Component} from 'react';
import './App.css';

class Footer extends Component{
  render(){
  return (
    <div className="footer">
      <h2>User Activities </h2>
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
                <tr>
                  <td>1</td>
                  <td>0x465FB</td>
                  <td>1ETH</td>
                  <td>350DAI</td>
                  <td>13/08/2020</td>
                  <td>23/08/2020</td>
                  <td><button className ="matchButton">Clear</button></td>
                  <td><button className ="matchButton">Execute</button></td>

                </tr>
              </tbody>
              </table>
    </div>
  )
}}

export default Footer;