package com.amazonaws.lambda.demo;

public class OrgCancelMeetingRequest {
	String meetingID;
	String scheduleID;
	
	public OrgCancelMeetingRequest(String mID, String sID) {
		meetingID = mID;
		scheduleID = sID;
	}

}
