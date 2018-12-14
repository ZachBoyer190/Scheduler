package com.amazonaws.model;

import java.util.Date;

public class TimeSlot {
	
	public final String timeSlotID;
	public final String scheduleID;
	public final int startTime;
	public final Date date;
	public TimeSlotStatus status;
	public Meeting meeting;
	
	public TimeSlot (String id, String sID, int st, Date date, TimeSlotStatus status) {
		this.timeSlotID = id;
		this.scheduleID = sID;
		this.startTime = st;
		this.date = date;
		this.status = status;
		this.meeting = null;
	}
	
	public TimeSlot(String id, String sID, int st, Date date, TimeSlotStatus status, Meeting m) {
		this.timeSlotID = id;
		this.scheduleID = sID;
		this.startTime = st;
		this.date = date;
		this.status = status;
		this.meeting = m;
	}
	
	public boolean modifyStatus(String newStatus) {
		this.status = TimeSlotStatus.getStatus(newStatus);	
		return true;
	}
	
	public boolean setMeeting(Meeting m) {
		this.meeting = m;
		return true; 
	}

}
