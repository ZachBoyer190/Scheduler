package com.amazonaws.lambda.demo;

public class CloseTimeRequest {
	int time;
	String scheduleID;
	
	public CloseTimeRequest(int t, String id) {
		time = t;
		scheduleID = id;
	}

}
