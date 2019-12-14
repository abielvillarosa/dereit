pragma solidity ^0.5.2;

import "./MinterRole.sol";
import "./SafeMath1.sol";
import "./SecurityToken.sol";

interface ERC1973Interface {
    function addMinters(address _minter) external returns (bool);
    function removeMinters(address _minter) external returns (bool);
    function trigger() external returns (bool);
    function withdraw() external returns (bool);
    // function readyToMint() internal returns (bool);
}


contract DeReit is ERC1973Interface, MinterRole {
    
    using SafeMath for uint256;
    
    SecurityToken public TokenContract;

    uint256 public owner;
    uint256 public rewardsPeriod;
    
    //From ERC1973
    uint256 public roundMask = 0;
    uint256 public lastMintedBlockNumber;
    uint256 public totalParticipants = 0;
    uint256 public tokensPerBlock; 
    uint256 public blockFreezeInterval;
    address payable public tokencontractAddress;
    mapping(address => uint256) public participantMask; 
    
    uint256 public currentBlockNumber;
    address public tokenOwner;
    
    
    struct Investor{
        address payable investor;
        uint256 investmentAmount;
    }
    
    constructor (uint256 _tokensPerBlock, uint256 _rewardsPeriod, uint256 _blockFreezeInterval, address payable _tokencontractAddress) public {
        tokensPerBlock = _tokensPerBlock;
        rewardsPeriod = _rewardsPeriod;
        blockFreezeInterval = _blockFreezeInterval;
        tokencontractAddress = _tokencontractAddress;
        TokenContract = SecurityToken(_tokencontractAddress);
        tokenOwner = msg.sender;
        lastMintedBlockNumber = block.number;
    }
    
    // ERC1973 Functions - START
    
    /**
     * @dev Modifier to check if msg.sender is whitelisted as a minter. 
     */
    modifier isAuthorized() {
        require(isMinter(msg.sender));
        _;
    }
    
    function addMinters(address _minter) public returns (bool) {
        _addMinter(_minter);
        totalParticipants = totalParticipants.add(1);
        updateParticipantMask(_minter);
        return true;
    }
    
    function removeMinters(address _minter) external returns (bool) {
        totalParticipants = totalParticipants.sub(1);
        _removeMinter(_minter); 
        return true;
    }
    
    function trigger() external isAuthorized returns (bool) {
        bool res = readyToMint();
        if(res == false) {
            return false;
        } else {
            mintTokens();
            return true;
        }
    }
    
    
    function withdraw() external isAuthorized returns (bool) {
        uint256 amount = calculateRewards();
        if(approveWithdraw(amount)){
        TokenContract.transferFrom(tokenOwner, msg.sender, amount);
        return true;
        } else {
            return false;
        }
    }
    
    function approveWithdraw(uint256 _amount) internal isAuthorized returns (bool) {
        TokenContract.approve(tokenOwner, _amount);
        return true;
    }

    
    function readyToMint() private returns (bool) {
        currentBlockNumber = block.number;
        uint256 lastBlockNumber = lastMintedBlockNumber;
        if(currentBlockNumber > lastBlockNumber + blockFreezeInterval) { 
            return true;
        } else {
            return false;
        }
    }

    
    // ERC1973 Private Functions
    
    /**
     * @dev Function to calculate current rewards for a participant. 
     * @return A uint that returns the calculated rewards amount.
     */
    function calculateRewards() private returns (uint256) {
        uint256 playerMask = participantMask[msg.sender];
        uint256 rewards = roundMask.sub(playerMask);
        updateParticipantMask(msg.sender);
        return rewards;
    }
    
    /**
     * @dev Function to mint new tokens into the economy. 
     * @return A boolean that indicates if the operation was successful.
     */
    function mintTokens() private returns (bool) {
        currentBlockNumber = block.number;
        // uint256 tokenReleaseAmount = (currentBlockNumber.sub(lastMintedBlockNumber)).mul(tokensPerBlock);
        uint256 tokenReleaseAmount = tokensPerBlock;
        lastMintedBlockNumber = currentBlockNumber;
        TokenContract.mint(tokenOwner, tokenReleaseAmount);
        calculateTPP(tokenReleaseAmount);
        return true;
    }
    
    /**
     * @dev Function to calculate TPP (token amount per participant).
     * @return A boolean that indicates if the operation was successful.
     */
    function calculateTPP(uint256 tokens) private returns (bool) {
        uint256 tpp = tokens.div(totalParticipants);
        updateRoundMask(tpp);
        return true;
    }
    
    /**
     * @dev Function to update round mask. 
     * @return A boolean that indicates if the operation was successful.
     */
    function updateRoundMask(uint256 tpp) private returns (bool) {
        roundMask = roundMask.add(tpp);
        return true;
    }

    /**
     * @dev Function to update participant mask (store the previous round mask)
     * @return A boolean that indicates if the operation was successful.
     */
    function updateParticipantMask(address participant) private returns (bool) {
        uint256 previousRoundMask = roundMask;
        participantMask[participant] = previousRoundMask;
        return true;
    }
    //ERC1973 - END

    
    /**
     * @dev Function to register an Investor as Participant
     * @return A boolean that indicates if the operation was successful.
     */
    function registerInvestor(address _investor) public {
        addMinters(_investor);
    }
    
    function deposit() public payable {
        uint256 tokenDepositAmount = 5;
        TokenContract.mint(tokenOwner, tokenDepositAmount);
        TokenContract.transferFrom(tokenOwner, msg.sender, tokenDepositAmount);
    }
    
    mapping (uint => Investor) public InvestorChannel;
    
    function addInvestment(uint uid) public payable {
        InvestorChannel[uid].investmentAmount = msg.value;
        
    }
    
    function partialWithdrawal(uint uid) public payable {
        
    }
    
    function getInvestment(uint uid) public {
        
    }
    
    
    
    function withdrawInvestment(uint uid) public {
        uint256 toTransfer = InvestorChannel[uid].investmentAmount;
        (InvestorChannel[uid].investor).transfer(toTransfer);
    }
    
}