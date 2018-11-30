package com.amazonaws.lambda.demo;

public class CreateScheduleResponse {
	String response;
	String id;
	int httpCode;
	String secretCode;
	
	public CreateScheduleResponse (String s, String id, int code, String secretCode) {
		this.response = s;
		this.id = id;
		this.httpCode = code;
		this.secretCode = secretCode;
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
