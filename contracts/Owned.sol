pragma solidity ^0.4.13;

//contract Owned
contract Owned{

    //address storage variable that keeps track of the owner
    address contractOwner;

    event LogOwnerSet(address indexed previousOwner, address indexed newOwner);

    //modifier that allows execution from the owner only
    modifier fromOwner() {
        require(msg.sender == contractOwner);
        _;
    }

    //constructor
    function Owned() {
        contractOwner = msg.sender;
    }


    /**
     * Sets the new owner for this contract.
     *     It should roll back if the caller is not the current owner.
     *     It should roll back if the argument is the current owner.
     *     It should roll back if the argument is a 0 address.
     * @param newOwner The new owner of the contract
     * @return Whether the action was successful.
     * Emits LogOwnerSet.
     */
    function setOwner(address newOwner)
        fromOwner 
        returns(bool success) {
            require(newOwner != contractOwner);
            require(newOwner != address(0));
            contractOwner = newOwner;
            LogOwnerSet(msg.sender, newOwner);
            return true;
    }

    /**
     * @return The owner of this contract.
     */
    function getOwner()
        constant
        returns(address owner) {
            return contractOwner;
    }
}
