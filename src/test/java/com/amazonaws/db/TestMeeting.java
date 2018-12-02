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
			String scheduleID = "5b34a";
			String pName = "Ben";
			String secretCode = UUID.randomUUID().toString().substring(0, 5);
			
			Schedule schedule = sd.getSchedule(scheduleID);
			TimeSlot timeSlot = td.getTimeSlot(schedule.timeslots.get(0).timeSlotID);
			
			User participant = new User(pName, UserType.BASIC);
			
			Meeting m = new Meeting(id, schedule, timeSlot, participant, secretCode);
			
			boolean b = md.addMeeting(m);
			System.out.println("add meeting: " + id + " " + b);
			
			assertEquals(m.meetingID, md.getMeeting(id).meetingID);
			
		} catch (Exception e) {
			fail ("Couln't add meeting: " + e.getMessage());
		}
	}
}
