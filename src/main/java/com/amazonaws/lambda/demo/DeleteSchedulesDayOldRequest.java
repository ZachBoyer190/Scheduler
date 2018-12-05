package com.amazonaws.lambda.demo;

import java.util.Date;

public class DeleteSchedulesDayOldRequest {
	
	Date end_date;
	
	public DeleteSchedulesDayOldRequest(Date ed) {
		this.end_date = ed;
	}
	
	public String toString() {
		return (end_date.toString());
	}

}
