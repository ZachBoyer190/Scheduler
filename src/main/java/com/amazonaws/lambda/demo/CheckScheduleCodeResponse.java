package com.amazonaws.lambda.demo;

public class CheckScheduleCodeResponse {
	int httpCode;
	boolean status;
	
	public CheckScheduleCodeResponse(int code, boolean s) {
		httpCode = code;
		status = s;
	}

}
