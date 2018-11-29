package com.amazonaws.overhead;

import java.sql.Date;

public class Schedule {
	public final int id;
	public final String name;
	public final int startTime;
	public final int endTime;
	public final int delta;
	public final Date startDate;
	public final Date endDate;
	public final String secretCode;
	
	public Schedule(int i, String n, int st, int et, int d, Date sd, Date ed) {
		id = i;
		name = n;
		startTime = st;
		endTime = et;
		delta = d;
		startDate = sd;
		endDate = ed;
		
		//generate unique secret code
		secretCode = "";
	}
}
