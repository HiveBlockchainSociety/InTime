pragma solidity ^0.4.19;


// create the token
// make poeple send stake to the contract
// verify that the contract is fullfield

contract InTime {


	struct Participant {
		address addr;
		bool actif = false;	// ethereum address of the participants
		bool onTime;	
		uint balance = 0;	//keep track of the balance of a participant
		uint id;	
	}

	uint public totalMeetingStake;
	uint public participantsIn;

	mapping (address => Participant) hiveParticipants;
	Participant[] participantList;

	//array d'ids des participants à un meeting
	uint[] meetingParticipants;

		
//constructor
	function InTime () {
		
	}	

/********************************************
	REGISTRATION OF NEW PARTICIPATNTS


***********************************************/


function register () payable returns(bool res) public {
	
	require( hiveParticipants[msg.sender].actif == false );
	hiveParticipants[msg.sender].balance += msg.value;
	hiveParticipants[msg.sender].actif = true;
	participantList.push(hiveParticipants[msg.sender]);

}

/*******************************************

	GET INFO ON PARTICIPANTS

******************************************/


function getParticipant (uint _id) returns(Participant) public {
	return(participantList[_id]);
}
function getBalance () returns(uint) public{
	return(participantList[_id].balance);
}


/*********************************************

	NEW MEETING

	* set the meeting
	* reister the meeting's participants
	* verify if everyone was on time
	* redistribute the stake

*********************************************/	


	function setMeeting (uint _id) returns(bool res) public{
		
		require( hiveParticipants[msg.sender].actif == true);
		delete meetingParticipants;
		meetingParticipants.push(_id);
		participantsIn +=1;
	}

	// set who assist to a particular meeting  
	// the owner is always present
	// the participant call this function to be in buy sending his stake
	function participate (uint _id, uint _stake) public payable {

		require( hiveParticipants[msg.sender].actif == true );
		meetingParticipants.push(_id);
		participantsIn +=1;
		hiveParticipants[msg.sender].balance -= _stake;
		totalMeetingStake += _stake;
	}
	//retire les participants en retard
	function late(uint _id) public{

		hiveParticipants[participantList[_id]].onTime == false;
		participantsIn -= 1 ;
	}

	//redistribute the stake to the participant that are inTime  
	//end the meeting
	function redistribution() public{

		uint payedAmount = totalMeetingStake / participantsIn;
		//prend la liste des participants au meeting pour augmenter leur balance à hauteur du stake.
		for(uint i; i< participantsIn; i++){

			if(hiveParticipants[participantList[i].addr].onTime == true){
					hiveParticipants[participantList[i].balance += payedAmount;

			}
		}
		delete meetingParticipants;
		
	}


	/***************************************
		ETHER TRANSACTIONS

	**************************************/	
	
	//allow a participant to refund his account
	function refund (uint _id, uint _stake) public payable {
		//require to already be amongs the hiveParticipants
		require( hiveParticipants[msg.sender].actif == true );
		hiveParticipants[msg.sender].balance += _stake;

	}
	//withdraw from account
	function ethWithdraw(uint _id, uint _stake) public {

		require( hiveParticipants[msg.sender].actif == true );
		require(hiveParticipants[msg.sender].balance > _stake);
		
		hiveParticipants[msg.sender].transfer( _stake);

	}

}
