pragma solidity >=0.4.22 <0.7.0;


contract Pool{
    uint public date;
    uint256 public amount1; 
    uint256 public amount2; 
    string public token1; 
    string public token2;
    //uint256 public expiryDate,  // USING TIMESTAMP
    //luint256 public executionDate
    
    uint public offerCount = 0;
    mapping (uint => Offer) public offers;
    
    struct Offer {
        uint  id;
        uint256  amount1; 
        string  token1; 
        uint256  amount2;
        string  token2;
        uint256  expiryDate;  // USING TIMESTAMP
        uint256  executionDate;
        address payable owner; 
        bool matched;
    }
    
    event OfferCreated(
        uint  id,
        uint256  amount1,
        string  token1,
        uint256  amount2,
        string  token2,
        uint256  expiryDate, // USING TIMESTAMP
        uint256  executionDate,
        address payable owner, 
        bool matched
        );
    
    event OfferMatched(
        uint  id,
        uint256  amount1,
        string  token1,
        uint256  amount2,
        string  token2,
        uint256  expiryDate, // USING TIMESTAMP
        uint256  executionDate,
        address  owner, 
        bool matched
        );
    
    
    function createOffer (
        uint256 _amount1,
        string memory _token1,
        uint256 _amount2,
        string memory _token2,
        uint256 _expiryDate, // USING TIMESTAMP
        uint256 _executionDate) public payable{
            require(bytes(_token1).length > 0);
            require(bytes(_token2).length > 0);
            require(_amount1 > 0);
            require(_amount2 > 0);
            require(_expiryDate > now);
            require(_executionDate > _expiryDate);
            //require(msg.value >= _amount1);
            
            offerCount ++;
            offers[offerCount] = Offer(offerCount,_amount1, _token1, _amount2, _token2, _expiryDate, _executionDate, msg.sender, false);
            
            emit OfferCreated(offerCount,_amount1, _token1, _amount2, _token2, _expiryDate, _executionDate, msg.sender, false );
        }
        
    function matchOffer(
        uint _id,
        string memory _token2
        
        )public payable{
        //fetch the offerCount
        Offer memory _offer = offers[_id];
        //fetch the creater of the offer
        address payable _creator = _offer.owner;
        
        // _token2 = _offer.token2;
        // _amount2 = _offer.amount2;
        
        //make sure offer has a valid id
        require (_offer.id >0 && _offer.id <= offerCount);
        require(!_offer.matched);
        require(_creator != msg.sender);
        
        // Transfer ownership to the buyer
        //_offer.owner = msg.sender + _creator;        
        
        //changing status of offer
        _offer.matched = true;
        //update offer 
        offers[_id] = _offer;
        //transfer money
        //_creator.transfer(msg.value);
        emit OfferMatched(offerCount, _offer.amount1,  _offer.token1,  _offer.amount2,  _offer.token2,  _offer.expiryDate,  _offer.executionDate, msg.sender, true);
    }
}