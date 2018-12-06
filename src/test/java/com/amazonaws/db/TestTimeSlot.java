package com.amazonaws.db;

import java.util.UUID;
import java.util.Date;
import java.util.ArrayList;

import junit.framework.TestCase;

import com.amazonaws.model.Schedule;
import com.amazonaws.model.TimeSlot;

public class TestTimeSlot extends TestCase {
	
	public void testModify() {
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
	
	public void testCloseOnDate() {
		TimeSlotsDAO td = new TimeSlotsDAO();
		
		try {
			java.util.Date date = new java.util.Date(118, 11, 3);
			String schedID = "6847e";
			
			boolean b = td.closeOnDate(date, schedID);
			
			assertTrue(b);
		} catch (Exception e){
			fail("Couldn't close timeslots on Date: " + e.getMessage());
		}
	}
	
	public void testOpenOnDate() {
		TimeSlotsDAO td = new TimeSlotsDAO();
		
		try {
			java.util.Date date = new java.util.Date(118, 11, 3);
			String schedID = "6847e";
			
			boolean b = td.openOnDate(date, schedID);
			
			assertTrue(b);
		} catch (Exception e) {
			fail("Couldn't open timeslots on Date: " + e.getMessage());
		}
	}
	
	public void testCloseAtTime() {
		TimeSlotsDAO td = new TimeSlotsDAO();
		
		try {
			int time = 1200;
			String schedID = "6847e";
			
			boolean b = td.closeAtTime(time, schedID);
			
			assertTrue(b);
		} catch (Exception e) {
			fail("Couldn't close timeslots at time: " + e.getMessage());
		}
	}
	
	public void testOpenAtTime() {
		TimeSlotsDAO td = new TimeSlotsDAO();
		
		try {
			int time = 1200;
			String schedID = "6847e";
			
			boolean b = td.openAtTime(time, schedID);
			
			assertTrue(b);
		} catch (Exception e) {
			fail("Couldn't open timeslots at time: " + e.getMessage());
		}
	}
	
	public void testGetTimeSlot() {
		TimeSlotsDAO td = new TimeSlotsDAO();
		
		try {
			String id = "235fc";
			
			TimeSlot t = td.getTimeSlot(id);
			
			assertEquals(id, t.timeSlotID);
		} catch (Exception e) {
			fail("Couldn't get desired timeslot" + e.getMessage());
		}
	}
	

}
