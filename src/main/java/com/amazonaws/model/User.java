package com.amazonaws.model;

import java.util.ArrayList;

public class User {
	public final String name;
	// public final ArrayList<Meeting> meetings;
	public final UserType type;
	// public final ArrayList<Schedule> schedules;
	
	public User (String n, UserType ut) {
		this.name = n;
		this.type = ut;
	}

}
