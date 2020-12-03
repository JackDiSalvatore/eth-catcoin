const { expectEvent, expectRevert } = require('@openzeppelin/test-helpers')

const CatCoin = artifacts.require('CatCoin')

contract('CatCoin', async ([owner, alice, bob]) => {
  let catcoin
  const totalSupply = 3

  before('Create new instance of contract', async () => {
    catcoin = await CatCoin.new(totalSupply)
  })

  describe('Should mint new cats to contract owner upon creation', async () => {

    // Test: constructor()
    // Test: _mint(address to, uint256 catId, uint256 genes)
    it('Should mint net cat coins to the owner', async () => {
       const ownerBalance = await catcoin.balanceOf(catcoin.address)
       assert(ownerBalance == totalSupply, 'invalid owner balance ' + ownerBalance)
    })

  })

  describe('Should let users purchase a cat', async () => {
    let catcoinEtherInitial
    let aliceEtherInitial
    let catcoinCatsInitial
    let aliceCatsInitial

    let purchaseReceipt
    
    before('Get initial balances', async () => {
      catcoinEtherInitial = web3.utils.toBN(await web3.eth.getBalance(catcoin.address))
      aliceEtherInitial = web3.utils.toBN(await web3.eth.getBalance(alice))

      catcoinCatsInitial = parseInt(await catcoin.balanceOf(catcoin.address))
      aliceCatsInitial = parseInt(await catcoin.balanceOf(alice))

      console.log('catcoinEther: ' + catcoinEtherInitial)
      console.log('aliceEther: ' + aliceEtherInitial)
      console.log('catcoinCats: ' + catcoinCatsInitial)
      console.log('aliceCatsInitial: ' + aliceCatsInitial)
    })

    // Test: purchase(uint256 catId) payable external
    it('Alice buys catId 0', async () => {
      const etherValue = web3.utils.toWei('1')
      purchaseReceipt = await catcoin.purchase(0, { from: alice, value: etherValue })
    })

    // Test: event Sent(address from, address to, uint256 catId)
    it('Should emit a Sent event', async () => {
      expectEvent(purchaseReceipt, 'Sent', {
        from: catcoin.address,
        to: alice,
        catId: web3.utils.toBN(0)
      })
    })

    it('Should subtract the Ether balance of alice', async () => {
      const aliceEtherBalance = web3.utils.toBN(await web3.eth.getBalance(alice))
      // Here we check that the ether balance has decrease from
      // the initial balance.  We do not check the exact balance
      // because gas fees will make it imprecise
      assert(aliceEtherBalance.lt(aliceEtherInitial),
        'alice did not send the Ether')
    })

    // Test: ownerOf(uint256 catId)
    it('Should return the owner address of catId 0', async () => {
      const ownerOfCat0 = await catcoin.ownerOf(0)
      assert(ownerOfCat0 === alice, 'alice does not own cat 0')
    })

    // Test: balanceOf(address owner)
    it('Increase alices balance by 1', async () => {
      const aliceCats = parseInt(await catcoin.balanceOf(alice))
      console.log('aliceCatsInitial: ' + aliceCatsInitial)
      console.log('aliceCats: ' + aliceCats)
      assert(aliceCats === (aliceCatsInitial + 1),
        'alices balance did not increase')
    })

    it('Should decrease contracts balance by 1', async() => {
      const catcoinCats = parseInt(await catcoin.balanceOf(catcoin.address))
      console.log('catcoinCatsInitial: ' + catcoinCatsInitial)
      console.log('catcoinCats: ' + catcoinCats)
      assert(catcoinCats === (catcoinCatsInitial - 1),
        'contract balance did not decrease')
    })

  })

  // Test: getCat(uint256 catId) returns (uint32 color, uint16 generation)
  describe('Should return cat properties by id', async () => {

    it('Should return the cat Id 2 properties', async () => {
      const catProperties = await catcoin.getCat(2)
      console.log('catProperties.color: ' + catProperties.color)
      console.log('catProperties.generation: ' + catProperties.generation)
      assert(catProperties.color == 160, 'incorrect cat color ' + catProperties)
      assert(catProperties.generation == 0, 'incorrect generation')
    })

  })

  // TODO: Test for all the reverts and failing cases

})
