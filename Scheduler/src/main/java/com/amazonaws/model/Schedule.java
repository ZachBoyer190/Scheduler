package com.amazonaws.model;

import java.util.ArrayList;
import java.util.Date;

public class Schedule {
	//public final ArrayList<TimeSlot> timeslots;
	//public final User organizer;
	
	public final String scheduleID;
	public final String name;
	public final int startTime;
	public final int endTime;
	public final int slotDelta;
	public final Date startDate;
	public final Date endDate;
	public final String secretCode;
	
	public Schedule (String id, String name, int startTime, int endTime, int delta, Date startDate, Date endDate, String code) {
		this.scheduleID = id;
		this.name = name;
		this.startTime = startTime;
		this.endTime = endTime;
		this.slotDelta = delta;
		this.startDate = startDate;
		this.endDate = endDate;
		this.secretCode = code;
	
	}
}
