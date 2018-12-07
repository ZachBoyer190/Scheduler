package com.amazonaws.model;

public class Meeting {
	
	public final String meetingID;
	public final String scheduleID;
	public final String timeslotID;
	public final User participant;
	public final String secretCode;
	
	public Meeting (String id, String s, String ts, User p, String sc) {
		this.meetingID = id;
		this.scheduleID = s;
		this.timeslotID = ts;
		this.participant = p;
		this.secretCode = sc;
	}
	

}
