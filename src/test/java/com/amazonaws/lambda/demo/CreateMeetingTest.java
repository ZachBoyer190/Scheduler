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

public class CreateMeetingTest extends TestCase{
	
	Context createContext(String apiCall) {
		TestContext ctx = new TestContext();
		ctx.setFunctionName(apiCall);
		return ctx;
	}
	
	public void testCreateMeeting() throws IOException {
		CreateMeetingHandler handler = new CreateMeetingHandler();
		
		String scheduleID = "5b34a";
		String timeslotID = "01655";
		String uName = "Cory";
		
		CreateMeetingRequest cmr = new CreateMeetingRequest(scheduleID, timeslotID, uName);
		String createMeetingRequest = new Gson().toJson(cmr);
		String jsonRequest = new Gson().toJson(new PostRequest(createMeetingRequest));
		
		InputStream input = new ByteArrayInputStream(jsonRequest.getBytes());
		OutputStream output = new ByteArrayOutputStream();
		
		handler.handleRequest(input, output, createContext("create"));
		
		PostResponse post = new Gson().fromJson(output.toString(), PostResponse.class);
		CreateMeetingResponse resp = new Gson().fromJson(post.body, CreateMeetingResponse.class);
	}

}
