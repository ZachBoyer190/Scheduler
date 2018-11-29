package com.amazonaws.db;

import java.sql.Connection;
import java.sql.DriverManager;

public class DatabaseUtil {
	
	// TODO: The following needs to be configured and not stored here
	// for security type things
	public final static String rdsMySqlDatabaseUrl = "";
	public final static String dbUsername = "";
	public final static String dbPassword = "";
	
	public final static String jdbcTag = "";
	public final static String rdsMySqlDatabasePort = "3306";
	public final static String multiQueries = "";
	
	public final static String dbName = "";
	
	static Connection conn;
	
	protected static Connection connect() throws Exception {
		if (conn != null) {
			return conn;
		}
		
		try {
			Class.forName("com.mysql.jdbc.Driver");
			conn = DriverManager.getConnection(
					jdbcTag + rdsMySqlDatabasePort + ":" + rdsMySqlDatabasePort + "/" + dbName + multiQueries, 
					dbUsername, 
					dbPassword);
			
			return conn;
		} catch (Exception ex) {
			throw new Exception("Failed to connect to database");
		}
	}

}
