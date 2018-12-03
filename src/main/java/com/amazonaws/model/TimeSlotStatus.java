package com.amazonaws.model;

public enum TimeSlotStatus {
	
	OPEN,
	CLOSED,
	BOOKED;
	
	public static TimeSlotStatus getStatus(String s) {
		if (s.contains("OPEN")) {
			return OPEN;
		} else if (s.contains("CLOSED")) {
			return CLOSED;
		} else {
			return BOOKED;
		}
	}

}
