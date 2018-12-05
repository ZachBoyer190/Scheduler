package com.amazonaws.lambda.demo;

public class CheckScheduleCodeRequest {
	String scheduleID;
	String secretCode;
	
	public CheckScheduleCodeRequest(String id, String code) {
		scheduleID = id;
		secretCode = code;
	}

}
