package com.amazonaws.db;

import java.util.UUID;

import junit.framework.TestCase;

import com.amazonaws.model.Meeting;
import com.amazonaws.model.Schedule;
import com.amazonaws.model.TimeSlot;
import com.amazonaws.model.User;
import com.amazonaws.model.UserType;

public class TestMeeting extends TestCase {

	public void testCreate() {
		MeetingsDAO md = new MeetingsDAO();
		SchedulesDAO sd = new SchedulesDAO();
		TimeSlotsDAO td = new TimeSlotsDAO();
		
		try {
			String id = UUID.randomUUID().toString().substring(0, 5);
			String scheduleID = "266bf";
			String pName = "Ben";
			String secretCode = UUID.randomUUID().toString().substring(0, 5);
			
			Schedule schedule = sd.getSchedule(scheduleID);
			String timeSlot = schedule.timeslots.get(1).timeSlotID;
			
			User participant = new User(pName, UserType.BASIC);
			
			Meeting m = new Meeting(id, scheduleID, timeSlot, participant, secretCode);
			
			boolean b = md.addMeeting(m);
			System.out.println("add meeting: " + id + " " + b);
			
			assertEquals(m.meetingID, md.getMeeting(id).meetingID);
			
		} catch (Exception e) {
			fail ("Couln't add meeting: " + e.getMessage());
		}
	}
	
	public void testDelete() {
		MeetingsDAO mDAO = new MeetingsDAO();
		SchedulesDAO sDAO = new SchedulesDAO();
		TimeSlotsDAO tDAO = new TimeSlotsDAO();
		
		try {
			String id = UUID.randomUUID().toString().substring(0, 5);
			String scheduleID = "0fd25";
			String pName = "Ben";
			String secretCode = UUID.randomUUID().toString().substring(0, 5);
			
			Schedule schedule = sDAO.getSchedule(scheduleID);
			String timeSlot = schedule.timeslots.get(0).timeSlotID;
			
			User participant = new User(pName, UserType.BASIC);
			
			Meeting m = new Meeting(id, scheduleID, timeSlot, participant, secretCode);
			
			boolean b = mDAO.addMeeting(m);
			System.out.println("add meeting: " + id + " " + b);
			
			assertTrue(mDAO.deleteMeeting(id));
		} catch (Exception e) {
			fail("Couldn't delete meeting: " + e.getMessage());
		}
	}
}
