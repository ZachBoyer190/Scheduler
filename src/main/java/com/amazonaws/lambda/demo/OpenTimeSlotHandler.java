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

import com.amazonaws.db.SchedulesDAO;
import com.amazonaws.db.TimeSlotsDAO;
import com.amazonaws.model.Schedule;
import com.amazonaws.model.TimeSlot;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestStreamHandler;
import com.google.gson.Gson;

public class OpenTimeSlotHandler implements RequestStreamHandler {
	public LambdaLogger logger = null;

	Schedule schedule;

	boolean openTimeSlot(String scheduleID, String timeSlotID) throws Exception {
		if (logger != null) { logger.log("in openTimeSlot"); }
		SchedulesDAO sDAO = new SchedulesDAO();
		TimeSlotsDAO tDAO = new TimeSlotsDAO();
		TimeSlot ts = tDAO.getTimeSlot(timeSlotID);

		if(ts.modifyStatus("OPEN")) {
			tDAO.updateTimeSlotCancel(ts);
			this.schedule = sDAO.getSchedule(scheduleID);
			return true;
		}else {
			return false;
		}
	}

	@Override
	public void handleRequest(InputStream input, OutputStream output, Context context) throws IOException {
		logger = context.getLogger();
		logger.log("Loading Java Lambda handler to open timeslot");

		JSONObject headerJson = new JSONObject();
		headerJson.put("Content-Type", "application/json");
		headerJson.put("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
		headerJson.put("Access-Control-Allow-Origin", "*");

		JSONObject responseJson = new JSONObject();
		responseJson.put("headers", headerJson);

		OpenTimeSlotResponse response = null;

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
				response = new OpenTimeSlotResponse("OpenTimeSlot", 200, schedule);
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
			response = new OpenTimeSlotResponse("Bad Request: " + pe.getMessage(), 422, schedule);
			responseJson.put("body", new Gson().toJson(response));
			processed = true;
			body = null;
		}

		if (!processed) {
			OpenTimeSlotRequest req = new Gson().fromJson(body, OpenTimeSlotRequest.class);
			logger.log(req.toString());

			OpenTimeSlotResponse resp;
			try {
				if (openTimeSlot(req.scheduleID, req.timeSlotID)) {
					resp = new OpenTimeSlotResponse("Successfully opened timeslot" , 200, schedule);
				} else {
					resp = new OpenTimeSlotResponse("Unable to open timeslot", 422, schedule);
				}
			} catch (Exception e) {
				resp = new OpenTimeSlotResponse("Unable to open timeslot. (" + e.getMessage() + ")", 403, schedule);
			}

			responseJson.put("body", new Gson().toJson(resp, OpenTimeSlotResponse.class));
		}
		logger.log("end result: " + responseJson.toJSONString());
		logger.log(responseJson.toJSONString());
		OutputStreamWriter writer = new OutputStreamWriter(output, "UTF-8");
		writer.write(responseJson.toJSONString());
		writer.close();
	}
}
