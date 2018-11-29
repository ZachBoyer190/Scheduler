package com.amazonaws.lambda.demo;

public class GetScheduleRequest {
	String id;
	
	public GetScheduleRequest(String id) {
		this.id = id;
	}
	
	public String toString() {
		return(id);
	}

}
