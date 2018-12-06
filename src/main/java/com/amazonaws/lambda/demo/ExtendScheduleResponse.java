package com.amazonaws.lambda.demo;

import com.amazonaws.model.Schedule;

public class ExtendScheduleResponse {
	String response;
	int httpCode;
	Schedule schedule;
	
	public ExtendScheduleResponse(String res, int code, Schedule sched) {
		response = res;
		httpCode = code;
		schedule = sched;
	}

}
