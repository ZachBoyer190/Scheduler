package com.amazonaws.model;

import java.util.Date;

public class TimeSlot {
	
	public final String timeSlotID;
	public final Schedule schedule;
	public final int startTime;
	public final Date date;
	public TimeSlotStatus status;
	
	public TimeSlot (String id, Schedule s, int st, Date date, TimeSlotStatus status) {
		this.timeSlotID = id;
		this.schedule = s;
		this.startTime = st;
		this.date = date;
		this.status = status;
	}
	
	public boolean modifyStatus(String newStatus) {
		this.status = TimeSlotStatus.getStatus(newStatus);	
		return true;
	}

}
