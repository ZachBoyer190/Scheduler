package com.amazonaws.lambda.demo;

public class CreateMeetingRequest {
	
	String scheduleID;
	String timeslotID;
	String userName;
	
	public CreateMeetingRequest(String sID, String tID, String uName) {
		this.scheduleID = sID;
		this.timeslotID = tID;
		this.userName = uName;
	}
	
	public String toString() {
		return (scheduleID + ", " + timeslotID + ", " + userName);
	}

}
