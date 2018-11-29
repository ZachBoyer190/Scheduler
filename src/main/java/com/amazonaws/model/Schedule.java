package com.amazonaws.model;

import java.util.ArrayList;
import java.util.Date;

public class Schedule {
	public final ArrayList<TimeSlot> timeslots;
	final int minutes = 60;
	
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
		
		int numSlots = (minutes / delta) * (endTime - startTime);
		ArrayList<TimeSlot> slots = new ArrayList<>();
		for (int i = 0; i <= numSlots; i++) {
			int meetingSlotStart = startTime + (i*(delta/minutes));
			int meetingSlotEnd = meetingSlotStart + (delta/minutes);
			slots.add(new TimeSlot(null, meetingSlotStart, meetingSlotEnd, TimeSlotStatus.OPEN));
		}
		
		this.timeslots = slots;
	
	}
}
