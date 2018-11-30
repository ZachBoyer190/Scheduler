package com.amazonaws.model;

import java.util.Date;

public class TimeSlot {
	
	public final Meeting meeting;
	public final int startTime;
	public final Date startDate;
	public final TimeSlotStatus status;
	
	public TimeSlot (Meeting m, int st, Date sd, TimeSlotStatus status) {
		this.meeting = m;
		this.startTime = st;
		this.startDate = sd;
		this.status = status;
	}

}
