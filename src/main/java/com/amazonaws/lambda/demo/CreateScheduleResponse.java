package com.amazonaws.lambda.demo;

public class CreateScheduleResponse {
	String response;
	String id;
	int httpCode;
	
	public CreateScheduleResponse (String s, String id, int code) {
		this.response = s;
		this.id = id;
		this.httpCode = code;
	}
	
	//200 means success
	public CreateScheduleResponse (String s, String id) {
		this.response = s;
		this.id = id;
		this.httpCode = 200;
	}
	
	public String toString() {
		return "Response(" + response + ")";
	}
}
