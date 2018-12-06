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
	
	public void testCloseDate() throws IOException {
		CloseDateHandler handler = new CloseDateHandler();
		TimeSlotsDAO tDAO = new TimeSlotsDAO();
		
		java.util.Date date = new java.util.Date(118, 11, 03);
		String schedID = "6847e";

		CloseDateRequest cdr = new CloseDateRequest(date, schedID);
		String closeDateRequest = new Gson().toJson(cdr);
		String jsonRequest = new Gson().toJson(new PostRequest(closeDateRequest));
		
		InputStream input = new ByteArrayInputStream(jsonRequest.getBytes());
		OutputStream output = new ByteArrayOutputStream();
		
		handler.handleRequest(input, output, createContext("close"));
		
		PostResponse post = new Gson().fromJson(output.toString(), PostResponse.class);
		CloseDateResponse resp = new Gson().fromJson(post.body, CloseDateResponse.class);
		
		try {
			assertEquals("CLOSED", tDAO.getTimeSlot("0d4a7").status.toString());
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public void testOpenDate() throws IOException {
		OpenDateHandler handler = new OpenDateHandler();
		TimeSlotsDAO tDAO = new TimeSlotsDAO();
		
		java.util.Date date = new java.util.Date(118, 11, 03);
		String schedID = "6847e";

		OpenDateRequest odr = new OpenDateRequest(date, schedID);
		String openDateRequest = new Gson().toJson(odr);
		String jsonRequest = new Gson().toJson(new PostRequest(openDateRequest));
		
		InputStream input = new ByteArrayInputStream(jsonRequest.getBytes());
		OutputStream output = new ByteArrayOutputStream();
		
		handler.handleRequest(input, output, createContext("open"));
		
		PostResponse post = new Gson().fromJson(output.toString(), PostResponse.class);
		OpenDateResponse resp = new Gson().fromJson(post.body, OpenDateResponse.class);
		
		try {
			assertEquals("OPEN", tDAO.getTimeSlot("0d4a7").status.toString());
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public void testCloseAtTime() throws IOException {
		CloseTimeHandler handler = new CloseTimeHandler();
		TimeSlotsDAO tDAO = new TimeSlotsDAO();
		
		int time = 1200;
		String schedID = "6847e";

		CloseTimeRequest ctr = new CloseTimeRequest(time, schedID);
		String closeTimeRequest = new Gson().toJson(ctr);
		String jsonRequest = new Gson().toJson(new PostRequest(closeTimeRequest));
		
		InputStream input = new ByteArrayInputStream(jsonRequest.getBytes());
		OutputStream output = new ByteArrayOutputStream();
		
		handler.handleRequest(input, output, createContext("close"));
		
		PostResponse post = new Gson().fromJson(output.toString(), PostResponse.class);
		CloseTimeResponse resp = new Gson().fromJson(post.body, CloseTimeResponse.class);
		
		try {
			assertEquals("CLOSED", tDAO.getTimeSlot("395bd").status.toString());
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public void testOpenAtTime() throws IOException {
		OpenTimeHandler handler = new OpenTimeHandler();
		TimeSlotsDAO tDAO = new TimeSlotsDAO();
		
		int time = 1200;
		String schedID = "6847e";

		OpenTimeRequest otr = new OpenTimeRequest(time, schedID);
		String openTimeRequest = new Gson().toJson(otr);
		String jsonRequest = new Gson().toJson(new PostRequest(openTimeRequest));
		
		InputStream input = new ByteArrayInputStream(jsonRequest.getBytes());
		OutputStream output = new ByteArrayOutputStream();
		
		handler.handleRequest(input, output, createContext("open"));
		
		PostResponse post = new Gson().fromJson(output.toString(), PostResponse.class);
		OpenTimeResponse resp = new Gson().fromJson(post.body, OpenTimeResponse.class);
		
		try {
			assertEquals("OPEN", tDAO.getTimeSlot("395bd").status.toString());
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	

}
