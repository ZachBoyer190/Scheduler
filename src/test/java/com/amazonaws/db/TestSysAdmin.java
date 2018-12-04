package com.amazonaws.db;

import junit.framework.TestCase;

public class TestSysAdmin extends TestCase{
	
	public void testCheck() {
		SysAdminsDAO sADAO = new SysAdminsDAO();
		
		try {
			
			assertTrue(sADAO.checkSysAdmin("admin", "password"));
			
		} catch (Exception e) {
			fail("User does not exist: " + e.getMessage());
		}
	}
	

}
