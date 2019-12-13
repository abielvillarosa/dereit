import { ethers } from 'ethers'
import PublicEntryABI from './abi/PublicEntry.json'


export default class BlockchainClient {

    constructor(){
        window.ethereum.enable()
        this.provider = new ethers.providers.Web3Provider(window.web3.currentProvider)
        this.signer = this.provider.getSigner()
        this.dashboardContract = new ethers.Contract("0x563f1B58BD6f91B30F0f16A9767B3989DA8BF3Cb", PublicEntryABI, this.signer)
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