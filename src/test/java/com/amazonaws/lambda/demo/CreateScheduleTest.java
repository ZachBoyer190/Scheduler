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

public class CreateScheduleTest extends TestCase{
	
	Context createContext(String apiCall) {
		TestContext ctx = new TestContext();
		ctx.setFunctionName(apiCall);
		return ctx;
	}
	
	@SuppressWarnings("deprecation")
	public void testCreateSchedule() throws IOException {
		CreateScheduleHandler handler = new CreateScheduleHandler();
		
		Date startDate = new Date(2018-10-27);
		Date endDate = new Date(2018-10-30);

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

}
