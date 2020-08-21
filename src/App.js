import React, {Component} from 'react';
import './App.css';
import Header from './Components/Header';
//import Body from './Components/Body';
import Footer from './Components/Footer';
//import getAccounts from './Components/Header'

 

class App extends Component {
 
  render(){
  return (
    <div className="app">
      <Header />   
      
      <Footer />
    </div>
  )
}}

export default App;