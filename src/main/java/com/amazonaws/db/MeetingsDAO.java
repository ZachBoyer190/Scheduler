package com.amazonaws.db;

import java.sql.*;

import com.amazonaws.model.Meeting;
import com.amazonaws.model.Schedule;
import com.amazonaws.model.TimeSlot;
import com.amazonaws.model.User;
import com.amazonaws.model.UserType;

public class MeetingsDAO {

	java.sql.Connection conn;
	
	public MeetingsDAO() {
		try {
			conn = DatabaseUtil.connect();
		} catch (Exception e) {
			conn = null;
		}
	}
	
	public Meeting getMeeting(String meetingID) throws Exception {
		
		try {
			Meeting meeting = null;
			PreparedStatement ps = conn.prepareStatement("SELECT * FROM meetings WHERE ID=?;");
			ps.setString(1, meetingID);
			ResultSet resultSet = ps.executeQuery();
			
			while (resultSet.next()) {
				meeting = generateMeeting(resultSet);
			}
			
			resultSet.close();
			ps.close();
			
			return meeting;
		} catch (Exception e) {
			e.printStackTrace();
			throw new Exception("Failed to get meeting: " + e.getMessage());
		}
	}
	
	public boolean addMeeting(Meeting meeting) throws Exception {
		try {
			PreparedStatement ps = conn.prepareStatement("SELECT * FROM meetings WHERE ID=?;");
			ps.setString(1, meeting.meetingID);
			ResultSet resultSet = ps.executeQuery();
			
			while (resultSet.next()) {
				Meeting m = generateMeeting(resultSet);
				resultSet.close();
				return false;
			}
			
			ps = conn.prepareStatement("INSERT INTO meetings (ID, scheduleID, timeSlotID, participant, secretCode) values (?,?,?,?,?)");
			ps.setString(1, meeting.meetingID);
			ps.setString(2, meeting.scheduleID);
			ps.setString(3, meeting.timeslotID);
			ps.setString(4, meeting.participant.name);
			ps.setString(5, meeting.secretCode);
			
			ps.execute();
			
			return true;
		} catch (Exception e) {
			throw new Exception("Failed to insert new meeting: " + e.getMessage());
		}
	}
	
	public boolean deleteMeeting(String meetingID) throws Exception {
		try {
			PreparedStatement ps = conn.prepareStatement("DELETE FROM meetings WHERE ID=?;");
			ps.setString(1, meetingID);
			int numAffected = ps.executeUpdate();
			ps.close();
			
			return (numAffected == 1);
			
		} catch (Exception e) {
			throw new Exception("Failed to delete desired meeting: " + e.getMessage());
		}
	}
	
	private Meeting generateMeeting(ResultSet resultSet) throws Exception {
		String meetingID = resultSet.getString("ID");
		String scheduleID = resultSet.getString("scheduleID");
		String timeSlotID = resultSet.getString("timeslotID");
		String participantName = resultSet.getString("participant");
		String secretCode = resultSet.getString("secretCode");

		User participant = new User(participantName, UserType.BASIC);
		
		return new Meeting(meetingID, scheduleID, timeSlotID, participant, secretCode);
				
	}
}
