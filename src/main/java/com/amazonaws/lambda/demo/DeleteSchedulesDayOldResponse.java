package com.amazonaws.lambda.demo;

public class DeleteSchedulesDayOldResponse {
	
	String response;
	int httpCode;
	
	public DeleteSchedulesDayOldResponse(String s, int code) {
		this.response = s;
		this.httpCode = code;
	}
	
	public String toString() {
		return "Response(" + response + ")";
	}

}
