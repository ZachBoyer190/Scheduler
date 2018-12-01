package com.amazonaws.model;

public enum TimeSlotStatus {
	
	OPEN,
	CLOSED,
	BOOKED;
	
	public static TimeSlotStatus getStatus(String s) {
		if (s.contains("open")) {
			return OPEN;
		} else if (s.contains("closed")) {
			return CLOSED;
		} else {
			return BOOKED;
		}
	}

}
