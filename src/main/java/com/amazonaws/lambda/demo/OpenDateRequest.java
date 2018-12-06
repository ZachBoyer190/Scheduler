package com.amazonaws.lambda.demo;

import java.util.Date;

public class OpenDateRequest {
	Date date;
	String scheduleID;
	
	public OpenDateRequest(Date d, String id) {
		date = d;
		scheduleID = id;
	}
}
