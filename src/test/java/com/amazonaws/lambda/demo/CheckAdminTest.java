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

public class CheckAdminTest extends TestCase{
	
	Context createContext(String apiCall) {
		TestContext ctx = new TestContext();
		ctx.setFunctionName(apiCall);
		return ctx;
	}
	
	public void testCheckAdmin() throws IOException{
		GetSysAdminHandler handler = new GetSysAdminHandler();
		
		String username = "admin";
		String password = "password";
		
		GetSysAdminRequest gsar = new GetSysAdminRequest(username, password);
		String getSysAdminRequest = new Gson().toJson(gsar);
		String jsonRequest = new Gson().toJson(new PostRequest(getSysAdminRequest));
		
		InputStream input = new ByteArrayInputStream(jsonRequest.getBytes());
		OutputStream output = new ByteArrayOutputStream();
		
		handler.handleRequest(input, output, createContext("create"));
		
		PostResponse post = new Gson().fromJson(output.toString(), PostResponse.class);
		GetSysAdminResponse resp = new Gson().fromJson(post.body, GetSysAdminResponse.class);
		
		assertEquals(resp.httpCode, 200);
	}
	
	public void testDeleteSchedules() throws IOException{
		DeleteSchedulesDaysOldHandler handler = new DeleteSchedulesDaysOldHandler();
		
		java.util.Date date = new Date(118, 11, 8);
		
		DeleteSchedulesDayOldRequest dsr = new DeleteSchedulesDayOldRequest(date);
		String deleteRequest = new Gson().toJson(dsr);
		String jsonRequest = new Gson().toJson(new PostRequest(deleteRequest));
		
		InputStream input = new ByteArrayInputStream(jsonRequest.getBytes());
		OutputStream output = new ByteArrayOutputStream();
		
		handler.handleRequest(input, output, createContext("create"));
		
		PostResponse post = new Gson().fromJson(output.toString(), PostResponse.class);
		DeleteSchedulesDayOldResponse resp = new Gson().fromJson(post.body, DeleteSchedulesDayOldResponse.class);
		
		
	}

}
