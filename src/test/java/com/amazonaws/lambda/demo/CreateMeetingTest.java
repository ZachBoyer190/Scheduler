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

import com.amazonaws.db.MeetingsDAO;
import com.amazonaws.db.TimeSlotsDAO;
import com.amazonaws.services.lambda.runtime.Context;
import com.google.gson.Gson;

import junit.framework.TestCase;

public class CreateMeetingTest extends TestCase{
	
	Context createContext(String apiCall) {
		TestContext ctx = new TestContext();
		ctx.setFunctionName(apiCall);
		return ctx;
	}
	
	public void testCreateMeeting() throws IOException {
		CreateMeetingHandler handler = new CreateMeetingHandler();
		TimeSlotsDAO td = new TimeSlotsDAO();

		String scheduleID = "777f6";
		String timeslotID = "006c8";
		String uName = "Cory";
		
		CreateMeetingRequest cmr = new CreateMeetingRequest(scheduleID, timeslotID, uName);
		String createMeetingRequest = new Gson().toJson(cmr);
		String jsonRequest = new Gson().toJson(new PostRequest(createMeetingRequest));
		
		InputStream input = new ByteArrayInputStream(jsonRequest.getBytes());
		OutputStream output = new ByteArrayOutputStream();
		
		handler.handleRequest(input, output, createContext("create"));
		
		PostResponse post = new Gson().fromJson(output.toString(), PostResponse.class);
		CreateMeetingResponse resp = new Gson().fromJson(post.body, CreateMeetingResponse.class);
		
		try {
			assertEquals("BOOKED", td.getTimeSlot(timeslotID).status.toString());
		} catch (Exception e) {
			fail("Couldn't create meeting: " + e.getMessage());
		}

	}
	
	public void testDeleteMeetingOrg() throws IOException {
		OrgCancelMeetingHandler handler = new OrgCancelMeetingHandler();
		TimeSlotsDAO tD = new TimeSlotsDAO();
		
		String scheduleID = "1db6c";
		String timeslotID = "04f35";
		String meetingID = "6283d";
		
		OrgCancelMeetingRequest cmr = new OrgCancelMeetingRequest(meetingID, scheduleID);
		String cancelMeetingRequest = new Gson().toJson(cmr);
		String jsonRequest = new Gson().toJson(new PostRequest(cancelMeetingRequest));
		
		InputStream input = new ByteArrayInputStream(jsonRequest.getBytes());
		OutputStream output = new ByteArrayOutputStream();
		
		handler.handleRequest(input, output, createContext("cancel"));
		
		PostResponse post = new Gson().fromJson(output.toString(), PostResponse.class);
		CancelMeetingResponse resp = new Gson().fromJson(post.body, CancelMeetingResponse.class);
		
		try {
			assertEquals("OPEN", tD.getTimeSlot(timeslotID).status.toString());
		} catch (Exception e) {
			fail("Couldn't cancel meeting" + e.getMessage());
		}
	}
	
	public void testDeleteMeeting() throws IOException {
		CancelMeetingHandler handler = new CancelMeetingHandler();
		TimeSlotsDAO tD = new TimeSlotsDAO();
		
		String scheduleID = "1db6c";
		String meetingCode = "866773c2";
		String timeslotID = "04f5b";
		String meetingID = "d919c";
		
		CancelMeetingRequest cmr = new CancelMeetingRequest(meetingID, meetingCode, scheduleID);
		String cancelMeetingRequest = new Gson().toJson(cmr);
		String jsonRequest = new Gson().toJson(new PostRequest(cancelMeetingRequest));
		
		InputStream input = new ByteArrayInputStream(jsonRequest.getBytes());
		OutputStream output = new ByteArrayOutputStream();
		
		handler.handleRequest(input, output, createContext("cancel"));
		
		PostResponse post = new Gson().fromJson(output.toString(), PostResponse.class);
		CancelMeetingResponse resp = new Gson().fromJson(post.body, CancelMeetingResponse.class);
		
		try {
			assertEquals("OPEN", tD.getTimeSlot(timeslotID).status.toString());
		} catch (Exception e) {
			fail("Couldn't cancel meeting" + e.getMessage());
		}
	}
	

}
