import React, { Component } from 'react';
import BlockchainClient from '../blockchain';
import NavBar from './NavBar';
import { withStyles } from '@material-ui/styles';
import { Typography, Button, makeStyles, createMuiTheme } from '@material-ui/core';
// import Image from 'material-ui-image';
import banner from './images/banner.png';
import LazyHero from 'react-lazy-hero';


const blockchain = new BlockchainClient();

const theme = createMuiTheme();

theme.spacing(4);

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    marginLeft: theme.spacing(2),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    marginLeft: theme.spacing(2),
  },
  buttonMargin: {
    spacing: 8,
  }
}));

class Home extends Component {

    constructor(props){
        super(props);
        this.state = {txHash : '', investorAddress : ''};
        this.handleClick = this.handleClick.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
        this.handleDeposit = this.handleDeposit.bind(this);
        this.handleClaim = this.handleClaim.bind(this);
        this.handleWithdraw = this.handleWithdraw.bind(this);
      }

    handleRegister(e){
        e.preventDefault()

        // let investorAddress = "0x10A21879783A76c20A70f4838dc18E01d0a1E8e7"
        let investorAddress = blockchain.getAddress()
        this.setState({investorAddress : investorAddress})

        blockchain.registerInvestor(investorAddress).then(res => {
            console.log(investorAddress);
            console.log(res);
            this.setState({txHash :res });
          })
      
    };

    handleDeposit(e){
        e.preventDefault()

        blockchain.deposit().then(res => {
            console.log(res);
            this.setState({txHash :res });
        })
    }

    handleClaim(e){
        e.preventDefault()

        blockchain.trigger().then(res => {
            console.log(res);
            this.setState({txHash :res });
        })
    }

    handleWithdraw(e){
        e.preventDefault()

        blockchain.withdraw().then(res => {
            console.log(res);
            this.setState({txHash :res });
        })
    }

    handleClick(e){
        e.preventDefault()
      };


    render () {
    return (

    <div>
      <NavBar />
    {/* <div class="columns is-mobile"> */}

        <div>
            <LazyHero imageSrc={ banner }>
                <h1>Decentralized REIT</h1>
            </LazyHero>

            <div align="center">
            <Button style={{margin:10 }} variant="outlined" align="center" color="primary" onClick={this.handleRegister}>Register as Investor</Button>

            {/* <Button style={{margin:10 }} variant="outlined" display="inline" color="primary" onClick={this.handleDeposit}>Deposit</Button>
            <Input defaultValue=" Amount (in Ethers)" display="inline" inputProps={{ 'aria-label': 'description' }} />
            <br/>
            <br/> */}

            <Button style={{margin:10 }} variant="outlined" color="primary" onClick={this.handleClaim}>Claim Reward</Button>

            <Button style={{margin:10 }} variant="outlined" color="primary" onClick={this.handleWithdraw}>Withdraw Investments</Button>
            {/* <br/>
            <br/> */}
            </div>

            <div align="center">
            <Typography style={{margin:10 }} variant="body1" noWrap>Deployed on: Ropsten</Typography>
            <Typography style={{margin:10 }} variant="body1" noWrap>Contract Address: 0x7EC9bdA4c5badc9D3A2728E4952687007F4e6B91</Typography>

            <Typography style={{margin:10 }} variant="body1" noWrap>Transaction Hash: {this.state.txHash}</Typography>
            </div>

        </div>
        </div>

    )
}}
    export default withStyles(useStyles)(Home);