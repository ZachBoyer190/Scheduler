package com.amazonaws.model;

public class Meeting {
	
	public final String meetingID;
	public final Schedule schedule;
	public final TimeSlot timeslot;
	public final User participant;
	public final String secretCode;
	
	public Meeting (String id, Schedule s, TimeSlot ts, User p, String sc) {
		this.meetingID = id;
		this.schedule = s;
		this.timeslot = ts;
		this.participant = p;
		this.secretCode = sc;
	}

}
