package com.amazonaws.db;

import java.util.UUID;
import java.util.Date;

import junit.framework.TestCase;

import com.amazonaws.model.Schedule;

public class TestSchedule extends TestCase {
	
	@SuppressWarnings("deprecation")
	public void testCreate() {
		SchedulesDAO sd = new SchedulesDAO();
		
		try {
			String id = UUID.randomUUID().toString().substring(0, 5);
			String secretCode = UUID.randomUUID().toString().substring(0, 5);
			Date start = new Date(2018, 01, 12);
			Date end = new Date(2018, 01, 20);
			Schedule schedule = new Schedule(id, "Kevin", 1200, 1500, 10, start, end, secretCode);
			boolean b = sd.addSchedule(schedule);
			System.out.println("add schedule" + b);
			
			assertEquals(schedule, sd.getSchedule(id));
		} catch (Exception e){
			fail ("couldn't add schedule: " + e.getMessage());
		}
	}
	

}
