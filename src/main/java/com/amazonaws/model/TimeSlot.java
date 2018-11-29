package com.amazonaws.model;

public class TimeSlot {
	
	public final Meeting meeting;
	public final int startTime;
	public final int endTime;
	public final TimeSlotStatus status;
	
	public TimeSlot (Meeting m, int st, int et, TimeSlotStatus status) {
		this.meeting = m;
		this.startTime = st;
		this.endTime = et;
		this.status = status;
	}

}
