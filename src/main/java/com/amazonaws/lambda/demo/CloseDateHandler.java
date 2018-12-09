package com.amazonaws.lambda.demo;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.util.Date;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import com.amazonaws.db.SchedulesDAO;
import com.amazonaws.db.TimeSlotsDAO;
import com.amazonaws.model.Schedule;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestStreamHandler;
import com.google.gson.Gson;

public class CloseDateHandler implements RequestStreamHandler{
	public LambdaLogger logger = null;

	Schedule schedule;

	boolean closeDate(String scheduleID, Date date) throws Exception {
		if (logger != null) { logger.log("in closeDate"); }
		SchedulesDAO sDAO = new SchedulesDAO();
		TimeSlotsDAO tDAO = new TimeSlotsDAO();
		
		boolean result = tDAO.closeOnDate(date, scheduleID);

		this.schedule = sDAO.getSchedule(scheduleID);
		
		return result;
	}

	@Override
	public void handleRequest(InputStream input, OutputStream output, Context context) throws IOException {
		logger = context.getLogger();
		logger.log("Loading Java Lambda handler to close date");

		JSONObject headerJson = new JSONObject();
		headerJson.put("Content-Type", "application/json");
		headerJson.put("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
		headerJson.put("Access-Control-Allow-Origin", "*");

		JSONObject responseJson = new JSONObject();
		responseJson.put("headers", headerJson);

		CloseDateResponse response = null;

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
				response = new CloseDateResponse("CloseDate", 200, schedule);
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
			response = new CloseDateResponse("Bad Request: " + pe.getMessage(), 422, schedule);
			responseJson.put("body", new Gson().toJson(response));
			processed = true;
			body = null;
		}

		if (!processed) {
			CloseDateRequest req = new Gson().fromJson(body, CloseDateRequest.class);
			logger.log(req.toString());

			CloseDateResponse resp;
			try {
				if (closeDate(req.scheduleID, req.date)) {
					resp = new CloseDateResponse("Successfully closed date" , 200, schedule);
				} else {
					resp = new CloseDateResponse("Unable to close date", 422, schedule);
				}
			} catch (Exception e) {
				resp = new CloseDateResponse("Unable to close date. (" + e.getMessage() + ")", 403, schedule);
			}

			responseJson.put("body", new Gson().toJson(resp, CloseDateResponse.class));
		}
		logger.log("end result: " + responseJson.toJSONString());
		logger.log(responseJson.toJSONString());
		OutputStreamWriter writer = new OutputStreamWriter(output, "UTF-8");
		writer.write(responseJson.toJSONString());
		writer.close();
	}

}
