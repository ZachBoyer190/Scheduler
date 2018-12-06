package com.amazonaws.lambda.demo;

import java.util.Date;

public class CloseDateRequest {
	Date date;
	String scheduleID;
	
	public CloseDateRequest(Date d, String id) {
		date = d;
		scheduleID = id;
	}

}
