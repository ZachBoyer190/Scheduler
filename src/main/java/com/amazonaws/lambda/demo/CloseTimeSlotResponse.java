package com.amazonaws.lambda.demo;

import com.amazonaws.model.Schedule;

public class CloseTimeSlotResponse {
	String response;
	int httpCode;
	Schedule schedule;
	
	public CloseTimeSlotResponse(String res, int code, Schedule sched) {
		response = res;
		httpCode = code;
		schedule = sched;
	}

}
