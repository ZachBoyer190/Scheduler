package com.amazonaws.lambda.demo;

import java.util.Date;

public class ExtendScheduleRequest {
	String scheduleID;
	Date startDate;
	Date endDate;
	
	public ExtendScheduleRequest(String id, Date start, Date end) {
		scheduleID = id;
		startDate = start;
		endDate = end;
	}

}
