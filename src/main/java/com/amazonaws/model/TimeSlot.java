package com.amazonaws.model;

import java.util.Date;

public class TimeSlot {
	
	public final String timeSlotID;
	public final String scheduleID;
	public final int startTime;
	public final Date date;
	public TimeSlotStatus status;
	
	public TimeSlot (String id, String sID, int st, Date date, TimeSlotStatus status) {
		this.timeSlotID = id;
		this.scheduleID = sID;
		this.startTime = st;
		this.date = date;
		this.status = status;
	}
	
	public boolean modifyStatus(String newStatus) {
		this.status = TimeSlotStatus.getStatus(newStatus);	
		return true;
	}

}
