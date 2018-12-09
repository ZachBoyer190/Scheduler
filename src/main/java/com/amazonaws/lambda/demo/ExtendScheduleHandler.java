package com.amazonaws.lambda.demo;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.util.Date;
import java.util.UUID;
import java.util.ArrayList;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import com.amazonaws.db.SchedulesDAO;
import com.amazonaws.db.TimeSlotsDAO;
import com.amazonaws.model.Schedule;
import com.amazonaws.model.TimeSlot;
import com.amazonaws.model.TimeSlotStatus;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestStreamHandler;
import com.google.gson.Gson;

public class ExtendScheduleHandler implements RequestStreamHandler{
	public LambdaLogger logger = null;

	Schedule schedule;

	boolean extendSchedule(String scheduleID, Date newStart, Date newEnd) throws Exception {
		if (logger != null) { logger.log("in extendSchedule"); }
		SchedulesDAO sDAO = new SchedulesDAO();
		TimeSlotsDAO tDAO = new TimeSlotsDAO();
		
		Schedule orig = sDAO.getSchedule(scheduleID);
		
		ArrayList<TimeSlot> slots = new ArrayList<>();
		
		boolean result = sDAO.extendSchedule(scheduleID, newStart, newEnd);
		
		long startDelta = orig.startDate.getTime() - newStart.getTime();
		long endDelta = newEnd.getTime() - orig.endDate.getTime();
		
		int numSlots = (int) ((((double) orig.endTime - (double)orig.startTime)*0.6) / (double)orig.slotDelta);
		
		if (startDelta > 0) {
			for(long i = orig.startDate.getTime() - 86400000; i >= newStart.getTime(); i -= 86400000) {
				int currentTime = orig.startTime;
				Date currentDate = new Date(i);
				
				if(orig.getDayOfWeek(currentDate) == 1 || orig.getDayOfWeek(currentDate) == 7) {
					continue;
				} else {
					
					for (int j = 0; j < numSlots; j++) {
						
						if(j != 0) {
						
							if (j % (60/orig.slotDelta) == 0) {
								currentTime += 40 + orig.slotDelta;
							} else {
								currentTime += orig.slotDelta;
							
							}
						}
						
						String slotID = UUID.randomUUID().toString().substring(0, 5);
						slots.add(new TimeSlot(slotID, orig.scheduleID, currentTime, currentDate, TimeSlotStatus.OPEN));	
					}
				}
			}
			
		} 
		
		if (endDelta > 0) {
			for(long i = orig.endDate.getTime() + 86400000; i <= newEnd.getTime(); i += 86400000) {
				int currentTime = orig.startTime;
				Date currentDate = new Date(i);
				
				if(orig.getDayOfWeek(currentDate) == 1 || orig.getDayOfWeek(currentDate) == 7) {
					continue;
				} else {
					
					for (int j = 0; j < numSlots; j++) {
						
						if(j != 0) {
						
							if (j % (60/orig.slotDelta) == 0) {
								currentTime += 40 + orig.slotDelta;
							} else {
								currentTime += orig.slotDelta;
							
							}
						}
						
						String slotID = UUID.randomUUID().toString().substring(0, 5);
						slots.add(new TimeSlot(slotID, orig.scheduleID, currentTime, currentDate, TimeSlotStatus.OPEN));	
					}
				}
			}
			
			
		}
		
		for (TimeSlot t: slots) {
			tDAO.addTimeSlot(t);
		}

		this.schedule = sDAO.getSchedule(scheduleID);
		
		return result;
	}

	@Override
	public void handleRequest(InputStream input, OutputStream output, Context context) throws IOException {
		logger = context.getLogger();
		logger.log("Loading Java Lambda handler to extend schedule");

		JSONObject headerJson = new JSONObject();
		headerJson.put("Content-Type", "application/json");
		headerJson.put("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
		headerJson.put("Access-Control-Allow-Origin", "*");

		JSONObject responseJson = new JSONObject();
		responseJson.put("headers", headerJson);

		ExtendScheduleResponse response = null;

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
				response = new ExtendScheduleResponse("ExtendSchedule", 200, schedule);
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
			response = new ExtendScheduleResponse("Bad Request: " + pe.getMessage(), 422, schedule);
			responseJson.put("body", new Gson().toJson(response));
			processed = true;
			body = null;
		}

		if (!processed) {
			ExtendScheduleRequest req = new Gson().fromJson(body, ExtendScheduleRequest.class);
			logger.log(req.toString());

			ExtendScheduleResponse resp;
			try {
				if (extendSchedule(req.scheduleID, req.startDate, req.endDate)) {
					resp = new ExtendScheduleResponse("Successfully extended schedule" , 200, schedule);
				} else {
					resp = new ExtendScheduleResponse("Unable to extend schedule", 422, schedule);
				}
			} catch (Exception e) {
				resp = new ExtendScheduleResponse("Unable to extend schedule. (" + e.getMessage() + ")", 403, schedule);
			}

			responseJson.put("body", new Gson().toJson(resp, ExtendScheduleResponse.class));
		}
		logger.log("end result: " + responseJson.toJSONString());
		logger.log(responseJson.toJSONString());
		OutputStreamWriter writer = new OutputStreamWriter(output, "UTF-8");
		writer.write(responseJson.toJSONString());
		writer.close();
	}
}
