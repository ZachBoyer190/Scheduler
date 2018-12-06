package com.amazonaws.lambda.demo;

import com.amazonaws.model.Schedule;

public class OpenDateResponse {
	String response;
	int httpCode;
	Schedule schedule;
	
	public OpenDateResponse(String res, int code, Schedule sched) {
		response = res;
		httpCode = code;
		schedule = sched;
	}
}
