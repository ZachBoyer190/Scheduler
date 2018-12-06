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

import com.amazonaws.db.SchedulesDAO;

public class CreateScheduleTest extends TestCase{
	
	Context createContext(String apiCall) {
		TestContext ctx = new TestContext();
		ctx.setFunctionName(apiCall);
		return ctx;
	}
	
	@SuppressWarnings("deprecation")
	public void testCreateSchedule() throws IOException {
		CreateScheduleHandler handler = new CreateScheduleHandler();
		
		Date startDate = new Date(118, 11, 01);
		Date endDate = new Date(118, 11, 06);

		CreateScheduleRequest csr = new CreateScheduleRequest("hi", 1000, 1500, 10, startDate, endDate);
		String createScheduleRequest = new Gson().toJson(csr);
		String jsonRequest = new Gson().toJson(new PostRequest(createScheduleRequest));
		
		InputStream input = new ByteArrayInputStream(jsonRequest.getBytes());
		OutputStream output = new ByteArrayOutputStream();
		
		handler.handleRequest(input, output, createContext("create"));
		
		PostResponse post = new Gson().fromJson(output.toString(), PostResponse.class);
		CreateScheduleResponse resp = new Gson().fromJson(post.body, CreateScheduleResponse.class);
		
	}
	
	public void testGetSchedule() throws IOException {
		GetScheduleHandler handler = new GetScheduleHandler();
		
		GetScheduleRequest gsr = new GetScheduleRequest("b5e9e");
		String getScheduleRequest = new Gson().toJson(gsr);
		String jsonRequest = new Gson().toJson(new PostRequest(getScheduleRequest));

		InputStream input = new ByteArrayInputStream(jsonRequest.getBytes());
		OutputStream output = new ByteArrayOutputStream();

		handler.handleRequest(input, output, createContext("get"));
		
		PostResponse post = new Gson().fromJson(output.toString(), PostResponse.class);
		GetScheduleResponse resp = new Gson().fromJson(post.body, GetScheduleResponse.class);

	}
	
	public void testGetSchedulesHoursOld() throws IOException {
		GetSchedulesHourHandler handler = new GetSchedulesHourHandler();
		
		GetSchedulesHourRequest gsr = new GetSchedulesHourRequest(1);
		String getSchedulesRequest = new Gson().toJson(gsr);
		String jsonRequest = new Gson().toJson(new PostRequest(getSchedulesRequest));
		
		InputStream input = new ByteArrayInputStream(jsonRequest.getBytes());
		OutputStream output = new ByteArrayOutputStream();
		
		handler.handleRequest(input, output, createContext("get"));
		
		PostResponse post = new Gson().fromJson(output.toString(), PostResponse.class);
		GetSchedulesHourResponse resp = new Gson().fromJson(post.body, GetSchedulesHourResponse.class);
		
	}
	
	public void testExtendSchedules() throws IOException {
		ExtendScheduleHandler handler = new ExtendScheduleHandler();
		SchedulesDAO sDAO = new SchedulesDAO();
		
		String scheduleID = "266bf";
		java.util.Date newStart = new java.util.Date(118, 11, 01);
		java.util.Date newEnd = new java.util.Date(118,11,15);
		
		ExtendScheduleRequest esr = new ExtendScheduleRequest(scheduleID, newStart, newEnd);
		String extendRequest = new Gson().toJson(esr);
		String jsonRequest = new Gson().toJson(new PostRequest(extendRequest));
		
		InputStream input = new ByteArrayInputStream(jsonRequest.getBytes());
		OutputStream output = new ByteArrayOutputStream();
		
		handler.handleRequest(input, output, createContext("extend"));
		
		PostResponse post = new Gson().fromJson(output.toString(), PostResponse.class);
		ExtendScheduleResponse resp = new Gson().fromJson(post.body, ExtendScheduleResponse.class);
		
		try {
			assertEquals(newStart, sDAO.getSchedule(scheduleID).startDate);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}

}
