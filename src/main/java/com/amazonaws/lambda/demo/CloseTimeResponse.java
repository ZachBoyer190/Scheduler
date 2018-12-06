package com.amazonaws.lambda.demo;

import com.amazonaws.model.Schedule;

public class CloseTimeResponse {
	String response;
	int httpCode;
	Schedule schedule;
	
	public CloseTimeResponse(String res, int code, Schedule sched) {
		response = res;
		httpCode = code;
		schedule = sched;
	}

}
