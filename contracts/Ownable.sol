pragma solidity ^0.5.16;

contract Ownable {
    event ownershipTransferred(address indexed previousOwner, address indexed newOwner);
    address private _owner;

    constructor() public {
        _owner = msg.sender;
    }

    modifier onlyOwner {
        require(_owner == msg.sender,
                'only smart contract _owner is authorized');
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        // Make sure newOwner address is valid
        if (newOwner != address(0)) {
            emit ownershipTransferred(_owner, newOwner);
            _owner = newOwner;
        }
    }

    function renounceOwnership() public onlyOwner {
        emit ownershipTransferred(_owner, address(0));
        _owner = address(0);
    }

}
