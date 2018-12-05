package com.amazonaws.lambda.demo;

public class OpenTimeSlotRequest {
	String timeSlotID;
	String scheduleID;
	
	public OpenTimeSlotRequest(String tsID, String sID) {
		timeSlotID = tsID;
		scheduleID = sID;
	}

}
