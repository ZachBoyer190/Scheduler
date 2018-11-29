package com.amazonaws.model;

public class Time {
	public final int hour;
	public final String day;
	public final String date;
	
	public Time (String date, String day, int hour) {
		this.date = date;
		this.day = day;
		this.hour = hour;
	}

}
