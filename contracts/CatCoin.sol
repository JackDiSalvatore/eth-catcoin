pragma solidity ^0.5.16;

import './Ownable.sol';

contract CatCoin is Ownable {
    // Events
    event Sent(address from, address to, uint256 catId);
    event Minted(address to, uint256 catId);

    // State Variables
    uint256 public _totalSupply;
    // tokenId -> address
    mapping(uint256 => address) private _catOwner;
    // address -> balance
    mapping(address => uint256) private _catOwnerBalance;

    struct Cat {
        uint32 color;
        uint16 generation;
    }

    Cat[] cats;

    constructor(uint256 totalSupply) public {
        _totalSupply = totalSupply;

        for (uint32 i = 0; i < totalSupply; i++) {
            cats.push(Cat((i+3) * 32, 0));
            _mint(address(this), cats.length - 1);
        }
    }

    function balanceOf(address owner) public view returns (uint256 balance) {
        return _catOwnerBalance[owner];
    }

    function ownerOf(uint256 catId) public view returns (address owner) {
        return _catOwner[catId];
    }

    function getCat(uint256 catId) public view returns (uint32 color, uint16 generation) {
        return (cats[catId].color, cats[catId].generation);
    }

    function purchase(uint256 catId) payable external {
        require(msg.value >= _etherToWei(1), 'not enough Ether sent');
        _transferFrom(address(this), msg.sender, catId);
    }

    function _mint(address to, uint256 catId) internal {
        _addCatTo(to, catId);
        emit Minted(to, catId);
    }

    function _transferFrom(address from, address to, uint256 catId) internal {
        require(catId >= 0 && catId <= _totalSupply, 'Cat ID is not valid');
        require(from == _catOwner[catId], 'sender is not the authorized owner');
        _removeCatFrom(from, catId);
        _addCatTo(to, catId);
        emit Sent(from, to, catId);
    }

    function _addCatTo(address to, uint256 catId) internal {
        require(_catOwner[catId] == address(0),
                'cat must be unowned before being transferred');
        _catOwner[catId] = to;
        _catOwnerBalance[to]++;
    }

    function _removeCatFrom(address from, uint256 catId) internal {
        require(from == _catOwner[catId], 'invalid sender address');
        _catOwnerBalance[from]--;
        // cat can be considered not owned by anyone
        _catOwner[catId] = address(0);
    }

    function _etherToWei(uint256 Ether) internal returns (uint256) {
        return Ether * 1000000000000000000;
    }

}
