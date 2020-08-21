import React, {Component} from 'react';
import './App.css';
import Web3 from 'web3';
import Logo from './Logo';
import Body from './Body';
//import Header from "./Header";
//import detectEthereumProvider from '@metamask/detect-provider' // provider means Web3 provider

//import PlaceOffer from './PlaceOffer';

// ABI imports
import ERC20ABI from '../ABIs/ERC20.json'
import LendingPoolAddressProviderABI from '../ABIs/AddressProvider.json'
import LendingPoolABI from '../ABIs/LendingPool.json'
import Pool from '../ABIs/Pool.json';
import Footer from './Footer';
//import Offerlist from './OfferList';



class Header extends Component{
//  state = { storageValue: 0, accounts: null, pool: null };

  async componentWillMount() {
    await this.getweb3();
    await this.loadBlockchain();
  }
    //LOAD WEB3 PROVIDER
    async getweb3(){
      const ethereumButton =  document.querySelector('.enableEthereumButton');
      const getMetaMask = document.querySelector('.getMetaMask');

      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum)
        console.log('MetaMask installed already!')
      }
      else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider)
      }
      else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')

        ethereumButton.addEventListener('click', () => {});
        getMetaMask.innerHTML = 'Non-Ethereum browser detected. You should consider trying MetaMask!';
      }
    }

    //LOADING BLOCKCHAIN NETWORK-DATA-CONTRACT
    async loadBlockchain(){
      //const ethereum = window.ethereum;
        const web3 = new Web3(window.web3.currentProvider)
      //const web3 = new Web3('https://kovan.infura.io/v3/cd81f3e4072349e584c8a09afb42caa6')

      const ethereumButton =  document.querySelector('.enableEthereumButton');
      ethereumButton.addEventListener('click', () => {window.ethereum.enable()});

        // Accounts loading
        const accounts = await web3.eth.getAccounts()
        this.setState({account: accounts[0]})
            // Handle Accounts changed
            // let currentAccount = null;
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            function handleAccountsChanged(_accounts) {
              window.location.reload();
            };

        // NetworkType Loading
        const networkTypes = await web3.eth.net.getNetworkType()
        this.setState({networkType: networkTypes})
            // networkType changed
            // let currentnetworkType = networkTypes;
            window.ethereum.on('chainChanged', handleChainChanged);
            function handleChainChanged(_networkType) {
              window.location.reload();
            }

        //NetworkData + Contract loading
        const networkId = await web3.eth.net.getId();
        console.log(networkId);

        const networkData = Pool.networks[networkId]
        //console.log(networkData)
          //checking the contract is deployed or not on Network
          if(networkData){
            const pool =  new web3.eth.Contract(Pool.abi, networkData.address)
            this.setState({pool})
            //this.setState({loading: false})
            console.log(pool)
            console.log(networkData.address)
            //OfferCount
            const offerCount = await pool.methods.offerCount().call()
            console.log(offerCount.toString())
            this.setState({offerCount})
            //Load Offers in order to fetch all the created offers to show on Match box
            for (var i = 1; i <= offerCount; i++) {
              const offer = await pool.methods.offers(i).call()
              this.setState({
                offers: [...this.state.offers, offer]
              })
            }
            console.log(this.state.offers)
          }else{
            console.log('Contract not deployed to detected network.')
          }
      }

      constructor(props) {
        super(props)
        this.state = {
          account: '',
          networkType: '',
          offerCount:0,
          offers: [],
          loading: true
        }

      this.createOffer = this.createOffer.bind(this);
      this.matchOffer = this.matchOffer.bind(this);

      }

      //CREATE OFFER FUNCTION
      async createOffer(amount1, token1, amount2, token2, expiryDate, executionDate){
        this.state.pool.methods
        .createOffer(amount1, token1, amount2, token2, expiryDate, executionDate)
        .send({from: this.state.account})

        const web3 = new Web3(window.web3.currentProvider)
        const amountOffer = amount1
        const tokenOffer = token1
        const referralCode = "0"

          if(tokenOffer === 'ETH'){
            const ethAddress = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
              try{
                window.ethereum
                .request({
                  method: 'eth_sendTransaction',
                  params: [
                    {
                      from: this.state.account,
                      to: ethAddress,
                      value: web3.utils.toHex(amountOffer),
                    },
                  ],
                })
                .then((txHash) => console.log(txHash))
                .catch((error) => console.error);

              } catch (e) {
                alert(e.message)
                console.log(e.message)
              }

            }else if (tokenOffer === 'DAI'){
              const daiAddress = "0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD" // kovan dai
              try {
                const lpCoreAddress = '0x95D1189Ed88B380E319dF73fF00E479fcc4CFa45';

                  // Approve the LendingPoolCore address with the dai contract
                  const daiContract = new web3.eth.Contract(ERC20ABI, daiAddress)
                    await daiContract.methods
                      .approve(lpCoreAddress, amountOffer)
                      .send({ from: this.state.account })
                      .catch((e) => {
                        throw Error(`Error approving eth allowance: ${e.message}`)
                      })

                  // Make the deposit transaction via LendingPool contract
                  const lpAddress = '0x580D4Fdc4BF8f9b5ae2fb9225D584fED4AD5375c';
                  const lpContract = new web3.eth.Contract(LendingPoolABI, lpAddress)
                    await lpContract.methods
                      .deposit(daiAddress, amountOffer, referralCode)
                      .send({ from: this.state.account })
                      .catch((e) => {
                        throw Error(`Error depositing to the LendingPool contract: ${e.message}`)
                      })
              } catch (e) {
                alert(e.message)
                console.log(e.message)
              }
            }else{
              alert('Sorry! Web have not support other Token')
            }

          // update state after Offer created


        }

      //MATCH OFFER
      async matchOffer(id, amount2, token){

        this.state.pool.methods
          .matchOffer(id, token)
          .send({ from: this.state.account })

        const web3 = new Web3(window.web3.currentProvider)
        const referralCode = "0"

          if(token === 'ETH'){
            const ethAddress = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
              try{
                window.ethereum
                .request({
                  method: 'eth_sendTransaction',
                  params: [
                    {
                      from: this.state.account,
                      to: ethAddress,
                      value: web3.utils.toHex(amount2),
                    },
                  ],
                })
                .then((txHash) => console.log(txHash))
                .catch((error) => console.error);

              } catch (e) {
                alert(e.message)
                console.log(e.message)
              }

            }else if (token === 'DAI'){
              const daiAddress = "0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD" // kovan dai
              try {
                const lpCoreAddress = '0x95D1189Ed88B380E319dF73fF00E479fcc4CFa45';

                  // Approve the LendingPoolCore address with the dai contract
                  const daiContract = new web3.eth.Contract(ERC20ABI, daiAddress)
                    await daiContract.methods
                      .approve(lpCoreAddress, amount2)
                      .send({ from: this.state.account })
                      .catch((e) => {
                        throw Error(`Error approving eth allowance: ${e.message}`)
                      })

                  // Make the deposit transaction via LendingPool contract
                  const lpAddress = '0x580D4Fdc4BF8f9b5ae2fb9225D584fED4AD5375c';
                  const lpContract = new web3.eth.Contract(LendingPoolABI, lpAddress)
                    await lpContract.methods
                      .deposit(daiAddress, amount2, referralCode)
                      .send({ from: this.state.account })
                      .catch((e) => {
                        throw Error(`Error depositing to the LendingPool contract: ${e.message}`)
                      })
              } catch (e) {
                alert(e.message)
                console.log(e.message)
              }
            }else{
              alert('Sorry! Web have not support other Token')
            }

      }


  render(){
    return (
      <div>

        <div className= "header">
          <Logo/>
          <button className="enableEthereumButton" id="enableEthereumButton">Connect Wallet</button>
        </div>

        <div className="info">
          <p className="showNetwork">{this.state.networkType.toUpperCase()}</p>
          <p className="showAccount">{this.state.account}</p>
          <p><a href="https://metamask.io/" className="getMetaMask"></a></p>
        </div>
         <Body
         offers = {this.state.offers}
         createOffer={this.createOffer}
         matchOffer={this.matchOffer}
         />


      </div>
    );
  }
  }
export default Header;
