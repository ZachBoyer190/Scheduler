package com.amazonaws.db;

import java.sql.Connection;
import java.sql.DriverManager;

public class DatabaseUtil {
	
	// TODO: The following needs to be configured and not stored here
	// for security type things
	public final static String rdsMySqlDatabaseUrl = "markab-scheduler.cvjeppbcgkkv.us-east-2.rds.amazonaws.com";
	public final static String dbUsername = "markab";
	public final static String dbPassword = "ohhihello190";
	
	public final static String jdbcTag = "jdbc:mysql://";
	public final static String rdsMySqlDatabasePort = "3306";
	public final static String multiQueries = "?allowMultiQueries=true";
	
	public final static String dbName = "innodb";
	
	static Connection conn;
	
	protected static Connection connect() throws Exception {
		if (conn != null) {
			return conn;
		}
		
		try {
			System.out.println("Connecting...");
			Class.forName("com.mysql.jdbc.Driver");
			conn = DriverManager.getConnection(
					jdbcTag + rdsMySqlDatabaseUrl + ":" + rdsMySqlDatabasePort + "/" + dbName + multiQueries, 
					dbUsername, 
					dbPassword);
			System.out.println("Successfully Connected to Database");
			return conn;
		} catch (Exception ex) {
			throw new Exception("Failed to connect to database");
		}
	}

}
