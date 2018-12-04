package com.amazonaws.lambda.demo;

import com.amazonaws.model.Schedule;

public class CancelMeetingResponse {
	String response;
	int httpCode;
	Schedule schedule;
	
	public CancelMeetingResponse(String res, int code, Schedule sched) {
		this.response = res;
		this.httpCode = code;
		this.schedule = sched;
	}

}
