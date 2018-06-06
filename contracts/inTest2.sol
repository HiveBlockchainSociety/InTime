pragma solidity ^0.4.19;

import "./Pausable.sol";
// create the token
// make poeple send stake to the contract
// verify that the contract is fullfield

contract InTime is Pausable {

	struct Participant {
		address addr;
		bool actif;	// ethereum address of the participants
		bool onTime;	
		uint balance;	//keep track of the balance of a participant
		uint id;
		uint meetings;
	}
	struct Meeting {
		string name;
		string time;
		uint stake;
		uint totalStake;
		address[] meetingParticipant;
	}
	uint public totalMeetingStake;
	uint public participantsIn;

	mapping (address => Participant) hiveParticipants;
	address[] participantList;

	//array d'ids des participants 
	Meeting[] meetingList;	

	//uint[2][] meetingList;




//solution de secour juste un update des balances par l'owner.

function updateBalance(int _userId, uint _amount) returns(bool){

		
}



//register participant

// create new meetings

// set meeting participants

//redistribute



}