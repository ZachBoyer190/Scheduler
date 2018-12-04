package com.amazonaws.lambda.demo;

public class CancelMeetingRequest {
	String meetingID;
	String meetingSecretCode;
	String scheduleID; //schedule ID
	
	public CancelMeetingRequest(String mID, String msc, String sID) {
		this.meetingID = mID;
		this.meetingSecretCode = msc;
		this.scheduleID = sID;
	}

}
