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
			sd.deleteSchedule(schedule);
			
			for(TimeSlot t: schedule.timeslots) {
				td.deleteTimeSlot(t);
			}
			
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
			
			assertEquals(0, schedules.size());
					
		} catch (Exception e) {
			fail("Couldn't get schedules older than date: " + e.getMessage());
		}
	}
	
	public void testDeleteDaysOld() {
		SchedulesDAO sd = new SchedulesDAO();
		
		try {
			Date end_date = new Date(118, 11, 04);
			boolean d = sd.deleteSchedulesDayOld(end_date);
			
			assertFalse(d);
		} catch (Exception e) {
			fail("Couldn't delete schedule older than date: " + e.getMessage());
		}
	}
	
	public void testGetHoursOld() {
		SchedulesDAO sd = new SchedulesDAO();
		
		try {
			ArrayList<Schedule> schedules = new ArrayList<>();
			schedules = sd.getSchedulesHoursOld(1);
			
			assertEquals(3, schedules.size());
			
		} catch (Exception e) {
			fail("Couldn't get schedules older than specified hours: " + e.getMessage());
		}
	}
	
	@SuppressWarnings("deprecation")
	public void testExtendSchedulesDates() {
		SchedulesDAO sd = new SchedulesDAO();
		
		try {
			String scheduleID = "1db6c";
			java.util.Date newStart = new java.util.Date(118, 11, 03);
			java.util.Date newEnd = new java.util.Date(119,00,10);
			boolean b = sd.extendSchedule(scheduleID, newStart, newEnd);
			System.out.println("Extended Schedule:" + b);
			
			assertEquals(newStart, sd.getSchedule(scheduleID).startDate);
		} catch (Exception e) {
			fail("Couldn't Extend Schedule: " + e.getMessage());
		}
	}


}
