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

import com.amazonaws.db.MeetingsDAO;
import com.amazonaws.db.SchedulesDAO;
import com.amazonaws.db.TimeSlotsDAO;

import com.amazonaws.model.Meeting;
import com.amazonaws.model.Schedule;
import com.amazonaws.model.TimeSlot;
import com.amazonaws.model.User;
import com.amazonaws.model.UserType;

import java.util.Date;
import java.util.UUID;

public class CreateMeetingHandler implements RequestStreamHandler{
	
	public LambdaLogger logger = null;
	
	String lastID;
	String editCode;
	Schedule schedule;
	
	boolean createMeeting(String scheduleID, String timeslotID, String userName) throws Exception {
		if (logger != null) { logger.log("in createMeeting"); }
		MeetingsDAO mDAO = new MeetingsDAO();
		SchedulesDAO sDAO = new SchedulesDAO();
		TimeSlotsDAO tDAO = new TimeSlotsDAO();
		Meeting m = null;
		
		try {		
			String mID = UUID.randomUUID().toString().substring(0, 5);
			lastID = mID;
		
			String sc = UUID.randomUUID().toString().substring(0, 8);
			editCode = sc;
			Schedule sched = sDAO.getSchedule(scheduleID);
			schedule = sched;
			TimeSlot timeslot = tDAO.getTimeSlot(timeslotID);
			User p = new User(userName, UserType.BASIC);
		
			m = new Meeting(mID, schedule, timeslot, p, sc);
			timeslot.modifyStatus("BOOKED");
			timeslot.setMeeting(m);
			tDAO.updateTimeSlot(timeslot);
		
		} catch (Exception e) {
			e.printStackTrace();
		}
		return mDAO.addMeeting(m);
		
	}
	
	@Override
	public void handleRequest(InputStream input, OutputStream output, Context context) throws IOException {
		logger = context.getLogger();
		logger.log("Loading Java Lambda handler to create meeting");
		
		JSONObject headerJson = new JSONObject();
		headerJson.put("Content-Type", "application/json");
		headerJson.put("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
		headerJson.put("Access-Control-Allow-Origin", "*");
		
		JSONObject responseJson = new JSONObject();
		responseJson.put("headers", headerJson);
		
		CreateMeetingResponse response = null;
		
		// extract body from incoming HTTP POST request. If error, return 422
		String body;
		boolean processed = false;
		try {
			BufferedReader reader = new BufferedReader(new InputStreamReader(input));
			JSONParser parser = new JSONParser();
			JSONObject event = (JSONObject) parser.parse(reader);
			logger.log("event: " + event.toJSONString());
			
			String method = (String) event.get("httpMethod");
			if(method != null && method.equalsIgnoreCase("OPTIONS")) {
				logger.log("Options request");
				response = new CreateMeetingResponse("id", lastID, 200, editCode, schedule);
				responseJson.put("body", new Gson().toJson(response));
				processed = true;
				body = null;
			} else {
				body = (String)event.get("body");
				if (body == null) {
					body = event.toJSONString();
				}
			}
		} catch (ParseException pe) {
			logger.log(pe.toString());
			response = new CreateMeetingResponse("Bad Request: " + pe.getMessage(), lastID, 422, editCode, schedule);
			responseJson.put("body", new Gson().toJson(response));
			processed = true;
			body = null;
		}
		
		if (!processed) {
			CreateMeetingRequest req = new Gson().fromJson(body, CreateMeetingRequest.class);
			logger.log(req.toString());
			
			CreateMeetingResponse resp;
			try {
				if (createMeeting(req.scheduleID, req.timeslotID, req.userName)) {
					resp = new CreateMeetingResponse("Successfully Created Meeting" , lastID, 200, editCode, schedule);
				} else {
					resp = new CreateMeetingResponse("Unable to create meeting", lastID, 422, editCode, schedule);
				}
			} catch (Exception e) {
				resp = new CreateMeetingResponse("Unable to create meeting. (" + e.getMessage() + ")", lastID, 403, editCode, schedule);
			}
			
			responseJson.put("body", new Gson().toJson(resp, CreateMeetingResponse.class));
		}
		logger.log("end result: " + responseJson.toJSONString());
		logger.log(responseJson.toJSONString());
		OutputStreamWriter writer = new OutputStreamWriter(output, "UTF-8");
		writer.write(responseJson.toJSONString());
		writer.close();
	}

}
