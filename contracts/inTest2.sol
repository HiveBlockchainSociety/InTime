pragma solidity ^0.4.19;


// create the token
// make poeple send stake to the contract
// verify that the contract is fullfield

contract InTime {


	struct Participant {
		address addr;	// ethereum address of the participants
		uint stake;
		bool onTime;	
		uint balance;	//keep track of the balance of a participant	
	}

	uint totalMeetingStake;
	uint participantsIn;

	mapping (address => Participant) hiveParticipants;

	//array d'ids des participants à un meeting
	uint[] meetingParticipants;
	

	function InTime () {
		
	}	
	function newMeeting (uint _id) returns(bool res) {
		//delete meetingParticipants;
		meetingParticipants.push(_id);
		
	}

	// set who assist to a particular meeting  
	// the owner is always present
	// the participant call this function to be in buy sending his stake
	function participate (uint _id, uint _stake) {

		meetingParticipants.push(_id);
		participantsIn +=1;
		//hiveParticipants[meetingParticipants[_id].addr].balance -= _stake;
		totalMeetingStake += _stake;
	}

	//retire les participants en retard
	function late(uint _id) {

	//	meetingParticipants[_id];
	}

	//redistribute the stake to the participant that are inTime  
	//end the meeting
	function redistribution() {

		uint payedAmount = totalMeetingStake / meetingParticipants.length;
		
		for(uint i; i< meetingParticipants.length;i++){

		//	meetingParticipants[_id].onTime.transfert(payedAmount);
		}
		delete meetingParticipants;
		
	}
	
	//allow a participant to refund his account
	function refund (uint _id, uint _stake) {

	//	hiveParticipants[_id].balance += _stake;

	}
	//withdraw from account
	function ethWithdraw(uint _id) {

	//	meetingParticipants[_id].addr.transfert(hiveParticipants[_id].balance);

	}

}
