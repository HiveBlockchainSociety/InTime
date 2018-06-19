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

//constructor
	function InTime () {
		 participantsIn = 0;
	}	

/********************************************
	REGISTRATION OF NEW PARTICIPATNTS


***********************************************/


function () payable  {
	
	require( hiveParticipants[msg.sender].actif == false );
	hiveParticipants[msg.sender].actif = true;
	hiveParticipants[msg.sender].balance += msg.value;
    hiveParticipants[msg.sender].addr = msg.sender;
	hiveParticipants[msg.sender].id = participantsIn;
	participantList.push(msg.sender);
	participantsIn += 1;



}

/*******************************************

	GET INFO ON PARTICIPANTS

******************************************/


function getBalance (uint _id) public view returns(uint) {
	return(hiveParticipants[participantList[_id]].balance);
}
function getAddress (uint _id) public view returns(address)  {
	address addr = participantList[_id];
	return addr;
}
function getId (address _addr) public view returns(uint) {
	return(hiveParticipants[_addr].id);
}




/*********************************************

	NEW MEETING

	* set the meeting
	* reister the meeting's participants
	* verify if everyone was on time
	* redistribute the stake

*********************************************/	


	function setMeeting (string _name,string _time, uint _stake)  returns(bool res) {
		
		//require( hiveParticipants[msg.sender].actif == true);
		//create a new meeting with the properties : time, name, id 
		//delete meetingParticipants;
		//meetingParticipants.push(_id);
		address yop = msg.sender;
		address[] meet;
		Meeting meeting = Meeting(_name, _time, _stake, 0, meet);
		meetingList.push(meeting);
        meetingList[meetingList.length-1].meet.push(yop);

		return true;
	}
	
	
	function getMeetingId() returns(uint) {
	    
	    
	    
	}

	// set who assist to a particular meeting  
	// the owner is always present
	// the participant call this function to be in buy sending his stake
	function participate (uint _id, uint _stake) public  {

		require( hiveParticipants[msg.sender].actif == true );
		require (msg.value == _stake);
		
		participantsIn +=1;
		hiveParticipants[msg.sender].balance -= _stake;
		totalMeetingStake += _stake;
	}
	//retire les participants en retard
	function late(uint _id) public{
        //require(participant to be in meeting, and the meeting he is assisting)
		hiveParticipants[participantList[_id]].onTime == false;
		
	}

	//redistribute the stake to the participant that are inTime  
	//end the meeting
	function redistribution() public{

		uint payedAmount = totalMeetingStake / participantsIn;
		//prend la liste des participants au meeting pour augmenter leur balance à hauteur du stake.
		for(uint i; i< participantsIn; i++){

			if(hiveParticipants[participantList[i]].onTime == true){
			    
			   
					hiveParticipants[meetingList[i].meetingParticipant[i]].balance += payedAmount;

			}
		}
		delete meetingList;
	}

/*************************************************
 * 
 *      Get Meeting id
 * 
 * *********************************************/


function getMeetingName (uint _id) public view returns(string) {
	return(meetingList[_id].name);
}
function getMeetingStake (uint _id) public view returns(uint) {
	return(meetingList[_id].stake);
}
function getMeetingTime (uint _id) public view returns(string) {
	return(meetingList[_id].time);
}


 /**************************************
  * 
  *         update balance
  * 
  * ***********************************/
  
  
  function diminueBalance (uint _id, uint _stake) public returns(uint) {
      
      
      hiveParticipants[participantList[_id]].balance -= _stake;
      
	return(hiveParticipants[participantList[_id]].balance);
}
  function enrichiBalance (uint _id, uint _stake) public returns(uint) {
      
      
      hiveParticipants[participantList[_id]].balance += _stake;
      
	return(hiveParticipants[participantList[_id]].balance);
}



	/***************************************
		ETHER TRANSACTIONS

	**************************************/	
	
	//allow a participant to refund his account
	function refund () public payable {
		//require to already be amongs the hiveParticipants
		require( hiveParticipants[msg.sender].actif == true );
		hiveParticipants[msg.sender].balance += msg.value;

	}
	//withdraw from account
	function ethWithdraw(uint _id, uint _amount) public {

		require( hiveParticipants[msg.sender].actif == true );
		require(hiveParticipants[msg.sender].balance > _amount);
		
	        participantList[_id].transfer( _amount);

	}

}