package com.amazonaws.model;

public class Meeting {
	
	public final User organizer;
	public final User participant;
	public final TimeSlot timeslot;
	public final String secretCode;
	public final String meetingID;
	
	public Meeting (User o, User p, TimeSlot ts, String sc, String id) {
		this.organizer = o;
		this.participant = p;
		this.timeslot = ts;
		this.secretCode = sc;
		this.meetingID = id;
	}

}
