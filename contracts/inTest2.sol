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
		uint poeplesIn;
		address[] meetingParticipant;
		address[] playerLate;
	}
	uint public totalMeetingStake;
	uint public participantsIn;

	mapping (address => Participant) hiveParticipants;
	address[] participantList;

	//array d'ids des participants 
	Meeting[] meetingList;


	//uint[2][] meetingList;

//constructor
	function InTime () public {
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
function getBalanceByAddress (address _addr) public view returns(uint) {
    return(hiveParticipants[_addr].balance);
}


/*********************************************

	NEW MEETING

	* set the meeting
	* reister the meeting's participants
	* verify if everyone was on time
	* redistribute the stake

*********************************************/	


	function setMeeting (string _name,string _time, uint _stake, address _firstPlayer)  returns(bool res) {
		
		//require( hiveParticipants[msg.sender].actif == true);
		//create a new meeting with the properties : time, name, id 
		//delete meetingParticipants;
		//meetingParticipants.push(_id);
		address yop = _firstPlayer;
		address[] meet;
		meet.push(yop);
		address[] latePoeple;
		Meeting memory meeting = Meeting(_name, _time, _stake, _stake, 1, meet,latePoeple);
		meetingList.push(meeting);

		return true;
	}
	

	// set who assist to a particular meeting  
	// the owner is always present
	// the participant call this function to be in buy sending his stake
	function participate (uint _id, uint _stake) public  {

		require( hiveParticipants[msg.sender].actif == true );
		require( hiveParticipants[msg.sender].balance > _stake);
		
		//get The meeting trough his id
		
		//hiveParticipants[msg.sender].balance -= _stake;
		meetingList[_id].totalStake += _stake;
		meetingList[_id].meetingParticipant.push(msg.sender);
	}
	//retire les participants en retard
	function late(uint _id, address _addr) public{
        //require(participant to be in meeting, and the meeting he is assisting)
        //récupérer le stake du meeting et le déduire du participants.
	   hiveParticipants[_addr].balance -= meetingList[_id].stake;
	   meetingList[_id].poeplesIn -= 1;
		
	}

	//redistribute the stake to the participant that are inTime  
	//end the meeting
	
	function compare(uint _id) view returns(address[] ){
	    
	    address[] inMemory;
        for(uint j; j<meetingList[_id].playerLate.length;j++){
	        
	       for(uint i; i<meetingList[_id].meetingParticipant.length;i++){
	        
    	        if( meetingList[_id].playerLate[j] == meetingList[_id].meetingParticipant[i]){
    	            inMemory.push(meetingList[_id].meetingParticipant[i]);
    	            
    	        }
	        
	         }
	        
	    }
	    return inMemory;
	}
	
	
	
	function redistribution(uint _id) public{

		uint payedAmount = meetingList[_id].totalStake /  meetingList[_id].poeplesIn;
		//prend la liste des participants au meeting pour augmenter leur balance à hauteur du stake.
		address[] memory inTimePoeple = compare(_id);
		
		for(uint a; a< inTimePoeple.length; a++){
		    
		    hiveParticipants[inTimePoeple[a]].balance += payedAmount;
		}

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