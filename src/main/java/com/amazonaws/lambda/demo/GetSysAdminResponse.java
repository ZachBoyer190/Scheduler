package com.amazonaws.lambda.demo;

public class GetSysAdminResponse {
	
	String response;
	int httpCode;
	
	public GetSysAdminResponse(String s, int code) {
		this.response = s;
		this.httpCode = code;
	}
	
	public String toString() {
		return "Response(" + response + ")";
	}

}
