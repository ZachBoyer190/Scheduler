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

import com.amazonaws.db.MeetingsDAO;
import com.amazonaws.db.SchedulesDAO;
import com.amazonaws.db.TimeSlotsDAO;
import com.amazonaws.model.Meeting;
import com.amazonaws.model.Schedule;
import com.amazonaws.model.TimeSlot;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestStreamHandler;
import com.google.gson.Gson;

public class CloseTimeSlotHandler implements RequestStreamHandler {
	public LambdaLogger logger = null;

	Schedule schedule;

	boolean closeTimeSlot(String scheduleID, String timeSlotID) throws Exception {
		if (logger != null) { logger.log("in closeTimeSlot"); }
		SchedulesDAO sDAO = new SchedulesDAO();
		TimeSlotsDAO tDAO = new TimeSlotsDAO();
		TimeSlot ts = tDAO.getTimeSlot(timeSlotID);

		this.schedule = sDAO.getSchedule(scheduleID);
		
		if(ts.modifyStatus("CLOSED")) {
			tDAO.updateTimeSlot(ts);
			return true;
		}else {
			return false;
		}
	}

	@Override
	public void handleRequest(InputStream input, OutputStream output, Context context) throws IOException {
		logger = context.getLogger();
		logger.log("Loading Java Lambda handler to close timeslot");

		JSONObject headerJson = new JSONObject();
		headerJson.put("Content-Type", "application/json");
		headerJson.put("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
		headerJson.put("Access-Control-Allow-Origin", "*");

		JSONObject responseJson = new JSONObject();
		responseJson.put("headers", headerJson);

		CloseTimeSlotResponse response = null;

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
				response = new CloseTimeSlotResponse("CloseTimeSlot", 200, schedule);
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
			response = new CloseTimeSlotResponse("Bad Request: " + pe.getMessage(), 422, schedule);
			responseJson.put("body", new Gson().toJson(response));
			processed = true;
			body = null;
		}

		if (!processed) {
			CloseTimeSlotRequest req = new Gson().fromJson(body, CloseTimeSlotRequest.class);
			logger.log(req.toString());

			CloseTimeSlotResponse resp;
			try {
				if (closeTimeSlot(req.scheduleID, req.timeSlotID)) {
					resp = new CloseTimeSlotResponse("Successfully closed timeslot" , 200, schedule);
				} else {
					resp = new CloseTimeSlotResponse("Unable to close timeslot", 422, schedule);
				}
			} catch (Exception e) {
				resp = new CloseTimeSlotResponse("Unable to close timeslot. (" + e.getMessage() + ")", 403, schedule);
			}

			responseJson.put("body", new Gson().toJson(resp, CloseTimeSlotResponse.class));
		}
		logger.log("end result: " + responseJson.toJSONString());
		logger.log(responseJson.toJSONString());
		OutputStreamWriter writer = new OutputStreamWriter(output, "UTF-8");
		writer.write(responseJson.toJSONString());
		writer.close();
	}
}
