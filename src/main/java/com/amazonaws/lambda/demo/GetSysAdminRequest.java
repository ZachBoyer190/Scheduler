package com.amazonaws.lambda.demo;

public class GetSysAdminRequest {
	String username;
	String password;
	
	public GetSysAdminRequest(String username, String password) {
		this.username = username;
		this.password = password;
	}
	
	public String toString() {
		return(username + ", " + password);
	}

}
