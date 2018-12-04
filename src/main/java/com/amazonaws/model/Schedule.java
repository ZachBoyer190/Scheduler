package com.amazonaws.model;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.UUID;

import com.amazonaws.db.TimeSlotsDAO;

public class Schedule {
	public final ArrayList<TimeSlot> timeslots;
	
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
		
		int numSlots = (int) ((((double) endTime - (double)startTime)*0.6) / (double)delta);
		
		ArrayList<TimeSlot> slots = new ArrayList<>();
		
		for (long i = startDate.getTime(); i <= endDate.getTime(); i += 86400000) {
			
			int currentTime = startTime;
			Date currentDate = new Date(i);
			
			if(getDayOfWeek(currentDate) == 1 || getDayOfWeek(currentDate) == 7) {
				i++;
				
			} else {
				
				for (int j = 0; j < numSlots; j++) {
				
					if(j != 0) {
					
						if (j % (60/slotDelta) == 0) {
							currentTime += 40 + slotDelta;
						} else {
							currentTime += slotDelta;
						
						}
					}
					String slotID = UUID.randomUUID().toString().substring(0, 5);
					slots.add(new TimeSlot(slotID, this.scheduleID, startTime, startDate, TimeSlotStatus.OPEN));	
				}
			
			}
		}
		
		this.timeslots = slots;
	
	}
	
	public Schedule (String id, String name, int startTime, int endTime, int delta, Date startDate, Date endDate, ArrayList<TimeSlot> slots, String code) {
		this.scheduleID = id;
		this.name = name;
		this.startTime = startTime;
		this.endTime = endTime;
		this.slotDelta = delta;
		this.startDate = startDate;
		this.endDate = endDate;
		this.timeslots = slots;
		this.secretCode = code;
	}
	
	private int getDayOfWeek(Date d) {
		Calendar c = Calendar.getInstance();
		c.setTime(d);
		int dayOfWeek = c.get(c.DAY_OF_WEEK);
		return dayOfWeek;
	}
}
