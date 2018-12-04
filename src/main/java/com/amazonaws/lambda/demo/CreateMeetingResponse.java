package com.amazonaws.lambda.demo;

import com.amazonaws.model.Schedule;

public class CreateMeetingResponse {
	String response;
	String id;
	int httpCode;
	String secretCode;
	Schedule schedule;
	
	public CreateMeetingResponse (String s, String id, int code, String secretCode, Schedule schedule) {
		this.response = s;
		this.id = id;
		this.httpCode = code;
		this.secretCode = secretCode;
		this.schedule = schedule;
	}
	
	public String toString() {
		return "Response(" + response + ")";
	}

}
