pragma solidity ^0.4.13;

import "./Owned.sol";

contract Pausable is Owned {
   
   //bool that keeps track of the paused state
   bool public pausedState;

    //Modifier whenPaused that rolls back the tx if the contract is in the false paused state
    modifier whenPaused() {
        require(pausedState);
        _;
    }

    //Modifier whenNotPaused that rolls back the tx if the contract is in the true paused state
    modifier whenNotPaused(){
        require(!pausedState);
        _;
    }
   

    /**
     * Event emitted when a new paused state has been set.
     * @param sender The account that ran the action.
     * @param newPausedState The new, and current, paused state of the contract.
     */
    event LogPausedSet(address indexed sender, bool indexed newPausedState);

    //Constructor that takes one param "initialState" which sets the initial paused state of the contract
    function Pausable(){
            pausedState = false;
    }

    /**
     * Sets the new paused state for this contract.
     *     It should roll back if the caller is not the current owner of this contract.
     *     It should roll back if the state passed is no different from the current.
     * @param newState The new desired "paused" state of the contract.
     * @return Whether the action was successful.
     * Emits LogPausedSet.
     */
    function setPaused
        (bool newState)
        fromOwner
        returns(bool success){
            require(newState != pausedState);
            pausedState = newState;
            LogPausedSet(msg.sender, newState);
            return true;
    }

    /**
     * @return Whether the contract is indeed paused.
     */
    function isPaused() constant returns(bool isIndeed){
        return pausedState;
    }

}