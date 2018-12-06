package com.amazonaws.lambda.demo;

import com.amazonaws.model.Schedule;

public class CloseDateResponse {
	String response;
	int httpCode;
	Schedule schedule;
	
	public CloseDateResponse(String res, int code, Schedule sched) {
		response = res;
		httpCode = code;
		schedule = sched;
	}

}
