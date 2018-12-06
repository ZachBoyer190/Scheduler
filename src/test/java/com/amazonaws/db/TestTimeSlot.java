package com.amazonaws.db;

import java.util.UUID;
import java.util.Date;
import java.util.ArrayList;

import junit.framework.TestCase;

import com.amazonaws.model.Schedule;
import com.amazonaws.model.TimeSlot;

public class TestTimeSlot extends TestCase {
	
	public void testOpen() {
		TimeSlotsDAO td = new TimeSlotsDAO();
		
		try {
			String newStatus = "BOOKED";
			String timeSlotID = "0018b";
			
			TimeSlot t = td.getTimeSlot(timeSlotID);
			t.modifyStatus(newStatus);
			
			td.updateTimeSlot(t);
			
			assertEquals("BOOKED", td.getTimeSlot(timeSlotID).status.toString());
			
		} catch (Exception e) {
			fail("Could not modify timeslot: " + e.getMessage());
		}
	}

}
