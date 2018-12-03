package com.amazonaws.lambda.demo;

public class CreateMeetingResponse {
	String response;
	String id;
	int httpCode;
	String secretCode;
	
	public CreateMeetingResponse (String s, String id, int code, String secretCode) {
		this.response = s;
		this.id = id;
		this.httpCode = code;
		this.secretCode = secretCode;
	}
	
	public CreateMeetingResponse(String s, String id) {
		this.response = s;
		this.id = id;
		this.httpCode = 200;
	}
	
	public String toString() {
		return "Response(" + response + ")";
	}

}
