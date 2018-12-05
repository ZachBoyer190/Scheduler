package com.amazonaws.lambda.demo;

import com.amazonaws.model.Schedule;

public class OpenTimeSlotResponse {
	String response;
	int httpCode;
	Schedule schedule;
	
	public OpenTimeSlotResponse(String res, int code, Schedule sched) {
		response = res;
		httpCode = code;
		schedule = sched;
	}
}
