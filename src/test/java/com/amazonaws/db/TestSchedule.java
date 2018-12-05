package com.amazonaws.db;

import java.util.UUID;
import java.util.Date;
import java.util.ArrayList;

import junit.framework.TestCase;

import com.amazonaws.model.Schedule;
import com.amazonaws.model.TimeSlot;

public class TestSchedule extends TestCase {
	
	@SuppressWarnings("deprecation")
	public void testCreate() {
		SchedulesDAO sd = new SchedulesDAO();
		TimeSlotsDAO td = new TimeSlotsDAO();
		
		try {
			String id = UUID.randomUUID().toString().substring(0, 5);
			String secretCode = UUID.randomUUID().toString().substring(0, 5);
			Date start = new Date(118, 11, 01);
			Date end = new Date(118, 11, 05);
			Schedule schedule = new Schedule(id, "Kevin", 1200, 1500, 10, start, end, secretCode);
			boolean b = sd.addSchedule(schedule);
			System.out.println("add schedule: " + id + " " + b);
			
			assertEquals(schedule.scheduleID, sd.getSchedule(id).scheduleID);
//			sd.deleteSchedule(schedule);
/*			
			for(TimeSlot t: schedule.timeslots) {
				td.deleteTimeSlot(t);
			}
			*/
		} catch (Exception e){
			fail ("couldn't add schedule: " + e.getMessage());
		}
	}
	
	@SuppressWarnings("deprecation")
	public void testDelete() {
		SchedulesDAO sd = new SchedulesDAO();
		TimeSlotsDAO td = new TimeSlotsDAO();
		
		try {
			String id = UUID.randomUUID().toString().substring(0, 5);
			String secretCode = UUID.randomUUID().toString().substring(0, 5);
			Date start = new Date(2018, 01, 12);
			Date end = new Date(2018, 01, 20);
			Schedule schedule = new Schedule(id, "TestDelete", 1200, 1500, 10, start, end, secretCode);
			boolean b = sd.addSchedule(schedule);
			System.out.println("add schedule: " + id + " " + b);
			
			assertTrue(sd.deleteSchedule(schedule));
			
			for(TimeSlot t: schedule.timeslots) {
				td.deleteTimeSlot(t);
			}
			
		} catch (Exception e) {
			fail("Couldn't delete schedule: " + e.getMessage());
		}
	}
	
	@SuppressWarnings("deprecation")
	public void testGetDaysOld() {
		SchedulesDAO sd = new SchedulesDAO();
		ArrayList<Schedule> schedules = new ArrayList<>();
		
		try {
			Date end_date = new Date(118, 11, 04);
			schedules = sd.getSchedulesDayOld(end_date);
			
			assertEquals(2, schedules.size());
					
		} catch (Exception e) {
			fail("Couldn't get schedules older than date: " + e.getMessage());
		}
	}
	
	public void testDeleteDaysOld() {
		SchedulesDAO sd = new SchedulesDAO();
		
		try {
			Date end_date = new Date(118, 11, 11);
			boolean d = sd.deleteSchedulesDayOld(end_date);
			
			assertTrue(d);
		} catch (Exception e) {
			fail("Couldn't delete schedule older than date: " + e.getMessage());
		}
	}

	/*
	public void testExist() {
		SchedulesDAO sd = new SchedulesDAO();
		
		try {
			assertFalse(sd.checkExist("34567"));
			
		} catch (Exception e){
			
			fail("didnt work: " + e.getMessage());
		}
	}
	*/

}
