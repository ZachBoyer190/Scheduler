package com.amazonaws.lambda.demo;

import com.amazonaws.model.Schedule;
import java.util.ArrayList;

public class GetSchedulesHourResponse {
	
	String response;
	int httpCode;
	ArrayList<Schedule> schedules;
	
	public GetSchedulesHourResponse(String s, ArrayList<Schedule> scheds, int code) {
		this.response = s;
		this.schedules = scheds;
		this.httpCode = code;
	}
	
	public String toString() {
		return "Response(" + response + ")";
	}

}
