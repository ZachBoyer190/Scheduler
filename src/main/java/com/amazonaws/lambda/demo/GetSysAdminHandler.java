package com.amazonaws.lambda.demo;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestStreamHandler;
import com.google.gson.Gson;

import com.amazonaws.db.SysAdminsDAO;

import com.amazonaws.model.User;
import com.amazonaws.model.UserType;

public class GetSysAdminHandler implements RequestStreamHandler{
	
	public LambdaLogger logger = null;
	SysAdminsDAO sADAO = new SysAdminsDAO();
	
	boolean checkSysAdmin(String username, String password) {
		if(logger != null) { logger.log("checking credentials"); }
		boolean result = false;
				
		try {
			result = sADAO.checkSysAdmin(username, password);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return result;
	}
	
	@Override
	public void handleRequest(InputStream input, OutputStream output, Context context) throws IOException{
		logger = context.getLogger();
		logger.log("Loading Java Lambda handler to get sysAdmin");
		
		JSONObject headerJson = new JSONObject();
		headerJson.put("Content-Type", "application/json");
		headerJson.put("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
		headerJson.put("Access-Control-Allow-Origin", "*");
		
		JSONObject responseJson = new JSONObject();
		responseJson.put("headers", headerJson);
		
		GetSysAdminResponse response = null;
		
		// extract body from incoming HTTP POST Request. Error = 422
		String body;
		boolean processed = false;
		try {
			BufferedReader reader = new BufferedReader(new InputStreamReader(input));
			JSONParser parser = new JSONParser();
			JSONObject event = (JSONObject) parser.parse(reader);
			logger.log("event: " + event.toJSONString());
			
			String method = (String) event.get("httpMethod");
			if(method != null && method.equals("OPTIONS")) {
				logger.log("Options Request");
				response = new GetSysAdminResponse("sysADMIN", 200);
				responseJson.put("body", new Gson().toJson(response));
				processed = true;
				body = null;
			} else {
				body = (String)event.get("body");
				if(body == null) {
					body = event.toJSONString();
				}
			}
		} catch (ParseException pe) {
			logger.log(pe.toString());
			response = new GetSysAdminResponse("Bad Request", 422);
			responseJson.put("body", new Gson().toJson(response));
			processed = true;
			body = null;
		}
		
		if(!processed) {
			GetSysAdminRequest req = new Gson().fromJson(body, GetSysAdminRequest.class);
			logger.log(req.toString());
			
			GetSysAdminResponse resp = null;
			try {
				if (sADAO.checkSysAdmin(req.username, req.password)) {
					resp = new GetSysAdminResponse("Access Granted", 200);
				} else {
					resp = new GetSysAdminResponse("User Does Not Exist", 403);
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
			
			responseJson.put("body", new Gson().toJson(resp));
			
		}
		
		logger.log("end result: " + responseJson.toJSONString());
		logger.log(responseJson.toJSONString());
		OutputStreamWriter writer = new OutputStreamWriter(output, "UTF-8");
		writer.write(responseJson.toJSONString());
		writer.close();
	
	}

}

