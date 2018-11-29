package com.amazonaws.model;

public class TimeSlot {
	
	public final Meeting meeting;
	public final Time startTime;
	public final Time endTime;
	public final TimeSlotStatus status;
	
	public TimeSlot (Meeting m, Time st, Time et, TimeSlotStatus status) {
		this.meeting = m;
		this.startTime = st;
		this.endTime = et;
		this.status = status;
	}

}
