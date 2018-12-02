package com.amazonaws.db;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import com.amazonaws.model.Schedule;
import com.amazonaws.model.TimeSlot;

public class SchedulesDAO {
	
	java.sql.Connection conn;
	
	public SchedulesDAO() {
		try {
			conn = DatabaseUtil.connect();
		} catch (Exception e) {
			conn = null;
		}
	}
	
	public Schedule getSchedule(String scheduleID) throws Exception{
		
		try {
			Schedule schedule = null;
			PreparedStatement ps = conn.prepareStatement("SELECT * FROM schedules WHERE ID=?;");
			ps.setString(1, scheduleID);
			ResultSet resultSet = ps.executeQuery();
			
			while (resultSet.next()) {
				schedule = generateSchedule(resultSet);
			}
			
			resultSet.close();
			ps.close();
			
			return schedule;
		} catch (Exception e) {
			e.printStackTrace();
			throw new Exception("Failed to get schedule" + e.getMessage());
		}
	}
	
	@SuppressWarnings("deprecation")
	public boolean addSchedule(Schedule schedule) throws Exception {
		try {
			PreparedStatement ps = conn.prepareStatement("SELECT * FROM schedules WHERE ID=?;");
			ps.setString(1, schedule.scheduleID);
			ResultSet resultSet = ps.executeQuery();
			
			// check to see if schedule already exists. Is this actually needed?
			while (resultSet.next()) {
				Schedule s = generateSchedule(resultSet);
				resultSet.close();
				return false;
			}
			
			ps = conn.prepareStatement("INSERT INTO schedules (ID, Name, startTime, endTime, Delta, startDate, endDate, secretCode) values(?,?,?,?,?,?,?,?)");
			ps.setString(1, schedule.scheduleID);
			ps.setString(2, schedule.name);
			ps.setInt(3, schedule.startTime);
			ps.setInt(4, schedule.endTime);
			ps.setInt(5, schedule.slotDelta);
			
			Date sqlStartDate = new java.sql.Date(schedule.startDate.getTime());
			Date sqlEndDate = new java.sql.Date(schedule.endDate.getTime());
			
			ps.setDate(6, sqlStartDate);
			ps.setDate(7, sqlEndDate);
			ps.setString(8, schedule.secretCode);
			ps.execute();
			ps.close();
			
			TimeSlotsDAO timeslots = new TimeSlotsDAO();
			for (TimeSlot t: schedule.timeslots) {
				timeslots.addTimeSlot(t);
			}
			
			return true;
			
		} catch (Exception e) {
			throw new Exception("Failed to insert new schedule: " + e.getMessage());
		}
	}
	
	public boolean deleteSchedule(Schedule schedule) throws Exception {
		try {
			PreparedStatement ps = conn.prepareStatement("DELETE FROM schedules WHERE ID=?;");
			ps.setString(1, schedule.scheduleID);
			int numAffected = ps.executeUpdate();
			ps.close();
			
			return (numAffected==1);
		} catch (Exception e) {
			throw new Exception("Failed to delete desired schedule: " + e.getMessage());
		}
		
	}
	
	private Schedule generateSchedule(ResultSet resultSet) throws Exception {
		String scheduleID = resultSet.getString("ID");
		String name = resultSet.getString("Name");
		int startTime = resultSet.getInt("startTime");
		int endTime = resultSet.getInt("endTime");
		int delta = resultSet.getInt("Delta");
		Date startDate = resultSet.getDate("startDate");
		Date endDate = resultSet.getDate("endDate");
		String secretCode = resultSet.getString("secretCode");
		
		TimeSlotsDAO slotDAO = new TimeSlotsDAO();
		
		ArrayList<TimeSlot> timeslots = slotDAO.getTimeSlotsFromSchedule(scheduleID);
		
		return new Schedule (scheduleID, name, startTime, endTime, delta, startDate, endDate, timeslots, secretCode);
		
	}
	
	public boolean checkExist(String scheduleID) throws Exception {
		
		try {
			PreparedStatement ps = conn.prepareStatement("SELECT * FROM schedules WHERE ID=?;");
			ps.setString(1, scheduleID);
			ResultSet resultSet = ps.executeQuery();
			
			while (resultSet.next()) {
				return true;
			}
			
			return false;
			
		} catch (Exception e) {
			throw new Exception ("Failed to check if schedule exists: " + e.getMessage());
		}
	}
	
}
