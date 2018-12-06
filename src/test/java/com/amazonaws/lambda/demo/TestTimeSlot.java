package com.amazonaws.lambda.demo;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;

import java.util.Date;

import org.junit.Assert;
import org.junit.Test;

import com.amazonaws.services.lambda.runtime.Context;
import com.google.gson.Gson;

import junit.framework.TestCase;

import com.amazonaws.db.TimeSlotsDAO;

public class TestTimeSlot extends TestCase{
	
	Context createContext(String apiCall) {
		TestContext ctx = new TestContext();
		ctx.setFunctionName(apiCall);
		return ctx;
	}
	
	public void testOpenTimeSlot() throws IOException {
		OpenTimeSlotHandler handler = new OpenTimeSlotHandler();
		TimeSlotsDAO tDAO = new TimeSlotsDAO();
		
		String timeSlotID = "0018b";
		String scheduleID = "5b604";
		
		OpenTimeSlotRequest osr = new OpenTimeSlotRequest(timeSlotID, scheduleID);
		String openTimeSlotRequest = new Gson().toJson(osr);
		String jsonRequest = new Gson().toJson(new PostRequest(openTimeSlotRequest));
		
		InputStream input = new ByteArrayInputStream(jsonRequest.getBytes());
		OutputStream output = new ByteArrayOutputStream();
		
		handler.handleRequest(input, output, createContext("open"));
		
		PostResponse post = new Gson().fromJson(output.toString(), PostResponse.class);
		OpenTimeSlotResponse resp = new Gson().fromJson(post.body, OpenTimeSlotResponse.class);
		
		try {
			assertEquals("OPEN", tDAO.getTimeSlot(timeSlotID).status.toString());
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public void testCloseTimeSlot() throws IOException {
		CloseTimeSlotHandler handler = new CloseTimeSlotHandler();
		TimeSlotsDAO tDAO = new TimeSlotsDAO();
		
		String timeSlotID = "0018b";
		String scheduleID = "5b604";
		
		CloseTimeSlotRequest csr = new CloseTimeSlotRequest(timeSlotID, scheduleID);
		String closeTimeSlotRequest = new Gson().toJson(csr);
		String jsonRequest = new Gson().toJson(new PostRequest(closeTimeSlotRequest));
		
		InputStream input = new ByteArrayInputStream(jsonRequest.getBytes());
		OutputStream output = new ByteArrayOutputStream();
		
		handler.handleRequest(input, output, createContext("close"));
		
		PostResponse post = new Gson().fromJson(output.toString(), PostResponse.class);
		CloseTimeSlotResponse resp = new Gson().fromJson(post.body, CloseTimeSlotResponse.class);
		
		try {
			assertEquals("CLOSED", tDAO.getTimeSlot(timeSlotID).status.toString());
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	

}
