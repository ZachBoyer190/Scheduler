package com.amazonaws.lambda.demo;

import com.amazonaws.model.Schedule;

public class GetScheduleResponse {
	String response;
	Schedule schedule;
	int httpCode;
	
	public GetScheduleResponse (String s, Schedule sched, int code) {
		this.response = s;
		this.schedule = sched;
		this.httpCode = code;
	}
	
	//200 means success
	public GetScheduleResponse (String s, Schedule sched) {
		this.response = s;
		this.schedule = sched;
		this.httpCode = 200;
	}
	
	public GetScheduleResponse (String s, int code) {
		this.response = s;
		this.schedule = null;
		this.httpCode = code;
	}
	
	public String toString() {
		return "Response(" + response + ")";
	}
}
