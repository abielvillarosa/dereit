import { ethers } from 'ethers'
import PublicEntryABI from './abi/PublicEntry.json'


export default class BlockchainClient {

    constructor(){
        window.ethereum.enable()
        this.provider = new ethers.providers.Web3Provider(window.web3.currentProvider)
        this.signer = this.provider.getSigner()
        this.dashboardContract = new ethers.Contract("0x7EC9bdA4c5badc9D3A2728E4952687007F4e6B91", PublicEntryABI, this.signer)
        // this.account = this.provider.getSigner()
        this.signer.getAddress().then((address) => {
            console.log("Wallet Address: " + address);
            this.address = address;
        });
    }

    async getAddress() {
            return this.address;
    }

    async registerInvestor(investorAddress) {
        let txHash = await this.dashboardContract.registerInvestor(investorAddress);
        return txHash.hash;
    }

    async deposit() {
        let txHash = await this.dashboardContract.deposit();
        return txHash.hash;
    }

    async trigger() {
        let txHash = await this.dashboardContract.trigger();
        return txHash.hash;
    }

    async approveWithdraw(tokenAmount) {
        let txHash = await this.dashboardContract.approveWithdraw(tokenAmount);
        return txHash.hash;
    }
    async withdraw() {
        let txHash = await this.dashboardContract.withdraw();
        return txHash.hash;
    }

}