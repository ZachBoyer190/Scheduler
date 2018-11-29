package com.amazonaws.lambda.demo;

import java.sql.Date;

public class CreateScheduleRequest {
	String name;
	int startTime;
	int endTime;
	int delta;
	Date startDate;
	Date endDate;
	String secretCode;
	
	public CreateScheduleRequest(String n, int st, int et, int d, Date sd, Date ed) {
		name = n;
		startTime = st;
		endTime = et;
		delta = d;
		startDate = sd;
		endDate = ed;
	}
	
	public String toString() {
		return(name + ", " + startTime + ", " + endTime + ", " + delta + ", " + startDate + ", " + endDate);
	}
	
}
