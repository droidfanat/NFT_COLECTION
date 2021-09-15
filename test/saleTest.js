const assertRevert = require("./assertRevert");
const ERC721Sale = artifacts.require('ERC721Sale');
const { expectEqual } = require('./utils/JS');

const maxTokens = "1000"; 
const maxMint = "10";
const maxPresaleMint = "2";
const price = "90000000000000000"; // 0.09 ETH



contract('ERC721 Colection Sale', ([alice, bob, inna, carol, salerRob, salerJon, minter]) => {
    beforeEach(async () => {
        this._ERC721Sale = await ERC721Sale.new("TEST", "TEST", maxTokens, maxMint, maxPresaleMint, price, {from:minter});
        await this._ERC721Sale.setBaseURI("https://opensea-creatures-api.herokuapp.com/api/creature/", {from:minter});
        await this._ERC721Sale.toggleTransferPause({from:minter});
    });

    it('pre-sale test', async () => {
        await this._ERC721Sale.toggleTransferPause({from:minter});
        await this._ERC721Sale.togglePreSale({from:minter});
        await this._ERC721Sale.addToWhitelist([salerRob, salerJon,], {from:minter});
        await assertRevert(this._ERC721Sale.presaleMintItems(1, {value: price, from: alice }));
        await assertRevert(this._ERC721Sale.presaleMintItems(3, {value: price, from: salerRob }));
        await assertRevert(this._ERC721Sale.presaleMintItems(1, {value: "80000000000000000", from: salerRob }));
        await this._ERC721Sale.presaleMintItems(1, {value: price, from: salerRob });
        await this._ERC721Sale.presaleMintItems(1, {value: price, from: salerRob });
        await assertRevert(this._ERC721Sale.presaleMintItems(1, {value: price, from: salerRob }));
        expectEqual(await this._ERC721Sale.balanceOf(salerRob), 2);
    });


    
    it('sale test', async () => {
        await this._ERC721Sale.toggleTransferPause({from:minter});
        await this._ERC721Sale.toggleSale({from:minter});
        await assertRevert(this._ERC721Sale.mintItems(11, {value: price, from: alice }));
        await assertRevert(this._ERC721Sale.mintItems(1, {value: "80000000000000000", from: alice }));
        await this._ERC721Sale.mintItems(10, {value: "900000000000000000", from: alice });
        await this._ERC721Sale.mintItems(10, {value: "900000000000000000", from: alice });
        await this._ERC721Sale.mintItems(10, {value: "900000000000000000", from: bob });
        expectEqual(await this._ERC721Sale.balanceOf(alice), 20);
        expectEqual(await this._ERC721Sale.balanceOf(bob), 10);
    });



    it('maximum sale test', async () => {
        await this._ERC721Sale.toggleTransferPause({from:minter});
        await this._ERC721Sale.toggleSale({from:minter});
        for (let index = 0; index < 50; index++) {
            await this._ERC721Sale.mintItems(10, {value: "900000000000000000", from: alice });
            await this._ERC721Sale.mintItems(10, {value: "900000000000000000", from: bob });
        }
        expectEqual(await this._ERC721Sale.balanceOf(alice), 500);
        expectEqual(await this._ERC721Sale.balanceOf(bob), 500);
        await assertRevert(this._ERC721Sale.mintItems(1, {value: price, from: carol }));
     });


});