package com.amazonaws.lambda.demo;

import com.amazonaws.model.Schedule;

public class OpenTimeResponse {
	String response;
	int httpCode;
	Schedule schedule;
	
	public OpenTimeResponse(String res, int code, Schedule sched) {
		response = res;
		httpCode = code;
		schedule = sched;
	}

}
