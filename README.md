# CatCoin

### Events
`Sent(address from, address to, uint256 catId)` - emits when cat ownership transferred
`Minted(address to, uint256 catId, uint256 genes)` - emits when new cat minted

### State Variables

`_catOwner` - mapping catId => owner address
`_ownerBalance` - mapping owner address => total number of owned cats

### Internal Variables

`Cat`:
* color
* generation

### Public Functions

Constructor

`constructor()` - creates new cats and mints them to the contract owner

Getters (Public)

`balanceOf(address) returns (uint256)` - returns cat balance of owner address
`ownerOf(uint256) returns (address)` - returns owner address of catId
`getCat(uint256) returns (uint32 color, uint16 generation)` - returns cat properties

Setters (Public)

`purchase(uint256 catId) payable public` - transfers ownership of catId from contrac to new owner address

Internal Functions

`_mint(address to, uint256 catId, uint256 genes)` - creates new cat and sends it to new owner
`_transferFrom(address from, address to, uint256 catId)` - transfer ownership of catId
`_addCatTo(address to, uint256 catId)` - transfer cat ownership to address
`_removeCatFrom(address from, uin256 catId)` - remove cat ownership from address

# eth-catcoin
