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
import com.amazonaws.model.Schedule;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestStreamHandler;
import com.google.gson.Gson;

public class CheckScheduleCodeHandler implements RequestStreamHandler {
	public LambdaLogger logger = null;

	boolean checkCode(String scheduleID, String sc) throws Exception {
		if (logger != null) { logger.log("in checkScheduleCode"); }
		SchedulesDAO sDAO = new SchedulesDAO();
		Schedule s = sDAO.getSchedule(scheduleID);
		
		if(s.secretCode.equals(sc)) {
			return true;
		}else {
			return false;
		}
	}

	@Override
	public void handleRequest(InputStream input, OutputStream output, Context context) throws IOException {
		logger = context.getLogger();
		logger.log("Loading Java Lambda handler to check schedule code");

		JSONObject headerJson = new JSONObject();
		headerJson.put("Content-Type", "application/json");
		headerJson.put("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
		headerJson.put("Access-Control-Allow-Origin", "*");

		JSONObject responseJson = new JSONObject();
		responseJson.put("headers", headerJson);

		CheckScheduleCodeResponse response = null;

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
				response = new CheckScheduleCodeResponse(200, false);
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
			response = new CheckScheduleCodeResponse(422, false);
			responseJson.put("body", new Gson().toJson(response));
			processed = true;
			body = null;
		}

		if (!processed) {
			CheckScheduleCodeRequest req = new Gson().fromJson(body, CheckScheduleCodeRequest.class);
			logger.log(req.toString());

			CheckScheduleCodeResponse resp;
			try {
				if (checkCode(req.scheduleID, req.secretCode)) {
					resp = new CheckScheduleCodeResponse(200, true);
				} else {
					resp = new CheckScheduleCodeResponse(422, false);
				}
			} catch (Exception e) {
				resp = new CheckScheduleCodeResponse(403, false);
			}

			responseJson.put("body", new Gson().toJson(resp, CheckScheduleCodeResponse.class));
		}
		logger.log("end result: " + responseJson.toJSONString());
		logger.log(responseJson.toJSONString());
		OutputStreamWriter writer = new OutputStreamWriter(output, "UTF-8");
		writer.write(responseJson.toJSONString());
		writer.close();
	}
}
