// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";



contract ERC721Sale is ERC721Pausable, Ownable { 
    using Counters for Counters.Counter; 
    Counters.Counter private _tokenIds;

    uint256 public  _maxTokens; 
    uint256 public  _maxMint;
    uint256 public  _price;
    bool private _saleActive = false;
    string public _prefixURI;


    constructor(string memory name, string memory ticker, uint256 maxTokens, uint256  maxMint, uint256 price) ERC721(name, ticker) {
        _maxTokens = maxTokens; 
        _maxMint = maxMint;
        _price = price;
    }

    function _baseURI() internal view override returns (string memory) {
        return _prefixURI;
    }

    function setBaseURI(string memory _uri) public onlyOwner {
        _prefixURI = _uri;
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }



    function mintItems(uint256 amount) public payable {
        require(_saleActive);
        require(amount <= _maxMint, "Max mint");
        require(_tokenIds.current() + amount <= _maxTokens, "sale max tokens owerflow");
        require(msg.value >= (amount * _price) , "payment below the price");
        for (uint256 i = 0; i < amount; i++) {
            _mintItem(msg.sender);
        }
    }

    function _mintItem(address to) internal returns (uint256) {
        _tokenIds.increment();
        uint256 id = _tokenIds.current();
        _safeMint(to, id);
        return id;
    }


    function toggleSale() public onlyOwner {
        _saleActive = !_saleActive;
    }

    function toggleTransferPause() public onlyOwner {
        paused() ? _unpause() : _pause();
    }

       
    // Allows minting(transfer from 0 address), but not transferring while paused() except from owner
    function _beforeTokenTransfer(address from,  address, uint256 ) internal virtual override {
        if (!(from == address(0)) && !(from == owner())) {
            require(!paused(), "ERC721Pausable: token transfer while paused");
        }
    }


    function withdraw() public payable onlyOwner {
        require(payable(msg.sender).send(address(this).balance));
    }


}