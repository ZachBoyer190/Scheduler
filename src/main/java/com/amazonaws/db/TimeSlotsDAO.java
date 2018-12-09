package com.amazonaws.db;

import java.util.ArrayList;
import java.sql.*;

import com.amazonaws.model.Meeting;
import com.amazonaws.model.TimeSlot;
import com.amazonaws.model.TimeSlotStatus;
import com.amazonaws.model.Schedule;

public class TimeSlotsDAO {
	
	java.sql.Connection conn;
	
	public TimeSlotsDAO() {
		try {
			conn = DatabaseUtil.connect();
		} catch (Exception e) {
			conn = null;
		}
	}
	
	public TimeSlot getTimeSlot(String timeslotID) throws Exception {
		
		try {
			TimeSlot timeslot = null;
			PreparedStatement ps = conn.prepareStatement("SELECT * FROM timeslots WHERE ID=?;");
			ps.setString(1,  timeslotID);
			ResultSet resultSet = ps.executeQuery();
			
			while (resultSet.next()) {
				timeslot = generateTimeSlot(resultSet);
			}
			
			resultSet.close();
			ps.close();
			
			return timeslot;
		} catch (Exception e) {
			e.printStackTrace();
			throw new Exception("Failed to get timeslot: " + e.getMessage());
		}
	}
	
public ArrayList<TimeSlot> getTimeSlotsFromSchedule(String scheduleID) throws Exception {
		
		try {
			ArrayList<TimeSlot> timeslots = new ArrayList<>();
			TimeSlot timeslot = null;
			PreparedStatement ps = conn.prepareStatement("SELECT * FROM timeslots WHERE scheduleID=?;");
			ps.setString(1,  scheduleID);
			ResultSet resultSet = ps.executeQuery();
			
			while (resultSet.next()) {
				timeslot = generateTimeSlot(resultSet);
				timeslots.add(timeslot);
			}
			
			resultSet.close();
			ps.close();
			
			return timeslots;
		} catch (Exception e) {
			e.printStackTrace();
			throw new Exception("Failed to get timeslot: " + e.getMessage());
		}
	}
	
	public boolean addTimeSlot(TimeSlot timeslot) throws Exception {
		try {
			PreparedStatement ps = conn.prepareStatement("SELECT * FROM timeslots WHERE ID=?;");
			ps.setString(1, timeslot.timeSlotID);
			ResultSet resultSet = ps.executeQuery();
			
			while (resultSet.next()) {
				TimeSlot t = generateTimeSlot(resultSet);
				return false;
			}
			
			ps = conn.prepareStatement("INSERT INTO timeslots (ID, scheduleID, startTime, date, status, meetingID) values(?,?,?,?,?,?)");
			ps.setString(1, timeslot.timeSlotID);
			ps.setString(2, timeslot.scheduleID);
			ps.setInt(3, timeslot.startTime);
			
			Date sqlDate = new java.sql.Date(timeslot.date.getTime());
			
			ps.setDate(4, sqlDate);
			ps.setString(5, timeslot.status.toString());
			ps.setString(6, "No meeting assigned yet");
			ps.execute();
			
			return true;
			
		} catch (Exception e) {
			throw new Exception("Failed to insert timeslot: " + e.getMessage());
		}
	}
	
	public boolean deleteTimeSlot(TimeSlot timeslot) throws Exception {
		try {
			PreparedStatement ps = conn.prepareStatement("DELETE FROM timeslots WHERE ID=?;");
			ps.setString(1, timeslot.timeSlotID);
			int numAffected = ps.executeUpdate();
			ps.close();
			
			return (numAffected == 1);
		} catch (Exception e) {
			throw new Exception("Failed to delete desired schedule: " + e.getMessage());
		}
	}
	
	public boolean updateTimeSlot(TimeSlot timeslot) throws Exception {
		try {
			PreparedStatement ps = conn.prepareStatement("UPDATE timeslots SET status=?, meetingID=? WHERE ID=?;");
			ps.setString(1, timeslot.status.toString());
			ps.setString(2,  "Meeting Canceled. No ID to Show");
			ps.setString(3,  timeslot.timeSlotID);
			int numAffected = ps.executeUpdate();
			ps.close();
			
			return (numAffected == 1);
			
		} catch (Exception e) {
			throw new Exception("Failed to update report: " + e.getMessage());
		}
	}
	
	public boolean closeOnDate(java.util.Date d, String scheduleID) throws Exception {
		try {
			PreparedStatement ps = conn.prepareStatement("UPDATE timeslots SET status='CLOSED' WHERE date=? AND scheduleID=?;");
			Date sqlDate = new java.sql.Date(d.getTime());
			ps.setDate(1, sqlDate);
			ps.setString(2,  scheduleID);
			int numAffected = ps.executeUpdate();
			ps.close();
			
			return (numAffected >= 1);
			
		} catch (Exception e) {
			throw new Exception("Failed to update report: " + e.getMessage());
		}
	}
	
	public boolean openOnDate(java.util.Date d, String scheduleID) throws Exception {
		try {
			PreparedStatement ps = conn.prepareStatement("UPDATE timeslots SET status='OPEN' WHERE date=? AND scheduleID=?;");
			Date sqlDate = new java.sql.Date(d.getTime());
			ps.setDate(1, sqlDate);
			ps.setString(2,  scheduleID);
			int numAffected = ps.executeUpdate();
			ps.close();
			
			return (numAffected >= 1);
			
		} catch (Exception e) {
			throw new Exception("Failed to update report: " + e.getMessage());
		}
	}
	
	public boolean closeAtTime(int time, String scheduleID) throws Exception {
		try {
			PreparedStatement ps = conn.prepareStatement("UPDATE timeslots SET status='CLOSED' WHERE startTime=? AND scheduleID=?;");
			ps.setInt(1, time);
			ps.setString(2,  scheduleID);
			int numAffected = ps.executeUpdate();
			ps.close();
			
			return (numAffected >= 1);
			
		} catch (Exception e) {
			throw new Exception("Failed to update report: " + e.getMessage());
		}
	}
	
	public boolean openAtTime(int time, String scheduleID) throws Exception {
		try {
			PreparedStatement ps = conn.prepareStatement("UPDATE timeslots SET status='OPEN' WHERE startTime=? AND scheduleID=?;");
			ps.setInt(1, time);
			ps.setString(2,  scheduleID);
			int numAffected = ps.executeUpdate();
			ps.close();
			
			return (numAffected >= 1);
			
		} catch (Exception e) {
			throw new Exception("Failed to update report: " + e.getMessage());
		}
	}
	
	private TimeSlot generateTimeSlot(ResultSet resultSet) throws Exception {
		String timeSlotID = resultSet.getString("ID");
		String scheduleID = resultSet.getString("scheduleID");
		int startTime = resultSet.getInt("startTime");
		Date date = resultSet.getDate("date");
		String status = resultSet.getString("status");
		String meetingID = resultSet.getString("meetingID");
		
		MeetingsDAO mDAO = new MeetingsDAO();
		
		Meeting m = mDAO.getMeeting(meetingID);
		
		java.util.Date utilDate = new java.util.Date(date.getTime());
	
		return new TimeSlot(timeSlotID, scheduleID, startTime, utilDate, TimeSlotStatus.getStatus(status), m);
		
	}

}
