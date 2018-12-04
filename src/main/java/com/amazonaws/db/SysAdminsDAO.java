package com.amazonaws.db;

import java.sql.*;

import com.amazonaws.model.User;
import com.amazonaws.model.UserType;

public class SysAdminsDAO {
	
	java.sql.Connection conn;
	
	public SysAdminsDAO() {
		try {
			conn = DatabaseUtil.connect();
		} catch (Exception e) {
			conn = null;
		}
	}
	
	public User getSysAdmin(String user, String pass) throws Exception {
		try {
			User sysAdmin = null;
			PreparedStatement ps = conn.prepareStatement("SELECT * FROM admins WHERE user=? AND password=?;");
			ps.setString(1, user);
			ps.setString(2, pass);
			ResultSet resultSet = ps.executeQuery();
			
			while (resultSet.next()) {
				sysAdmin = generateSysAdmin(resultSet);
			}
			
			resultSet.close();
			ps.close();
			
			return sysAdmin;
		} catch (Exception e) {
			e.printStackTrace();
			throw new Exception("User does not exist: " + e.getMessage());
		}
	}
	
	public boolean checkSysAdmin(String username, String password) throws Exception{
		try {
			PreparedStatement ps = conn.prepareStatement("SELECT * FROM admins WHERE user=? AND password=?;");
			ps.setString(1, username);
			ps.setString(2, password);
			ResultSet resultSet = ps.executeQuery();
			
			while(resultSet.next()) {
				return true;
			}
			
			return false;
		} catch (Exception e) {
			throw new Exception ("Failed to check credentials: " + e.getMessage());
		}
	}
	
	private User generateSysAdmin(ResultSet resultSet) throws Exception{
		String username = resultSet.getString("user");
		
		return new User(username, UserType.SYSADMIN);
	}
	


}
