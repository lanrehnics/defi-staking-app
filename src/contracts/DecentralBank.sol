pragma solidity ^0.5.0;

import "./Rwd.sol";
import "./Tether.sol";

contract DecentralBank {
    address public owner;
    string public name = "Decentral Bank";

    Tether public tether;
    Rwd public rwd;

    address[] public stakers;

    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(Rwd _rwd, Tether _tether) public {
        tether = _tether;
        rwd = _rwd;
        owner = msg.sender;
    }

    function depositTokens(uint256 _amount) public {
        require(_amount > 0, "amount cannot be 0");
        //Transfer tether tokens to this contract address for staking

        tether.transferFrom(msg.sender, address(this), _amount);

        // update staking balance
        stakingBalance[msg.sender] += _amount;

        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    function issueTokens() public {
        // require the owner to issue tokens only
        require(msg.sender == owner, "caller must be the owner");

        for (uint i=0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient] / 9; /// to create percentage incentive
            if (balance > 0) {
                rwd.transfer(recipient, balance);
            }
        }
    }

    function unstakeTokens() public {
    
        uint balance = stakingBalance[msg.sender];
        require(balance > 0, "staking balance cant be less than zero");

        // transfer the tokens to the specified contract address from our bank
        tether.transfer(msg.sender, balance);


        // reset staking balance
        stakingBalance[msg.sender] = 0;

        // Update Staking Status
        isStaking[msg.sender] = false;
        hasStaked[msg.sender] = false;

    }
}
