package com.amazonaws.lambda.demo;

public class CloseTimeSlotRequest {
	String timeSlotID;
	String scheduleID;
	
	public CloseTimeSlotRequest(String tsID, String sID) {
		timeSlotID = tsID;
		scheduleID = sID;
	}

}
