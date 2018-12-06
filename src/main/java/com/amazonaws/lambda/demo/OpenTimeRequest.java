package com.amazonaws.lambda.demo;

public class OpenTimeRequest {
	int time;
	String scheduleID;
	
	public OpenTimeRequest(int t, String id) {
		time = t;
		scheduleID = id;
	}

}
