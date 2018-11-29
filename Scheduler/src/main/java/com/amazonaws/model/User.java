package com.amazonaws.model;

import java.util.ArrayList;

public class User {
	public final String name;
	public final String email;
	public final ArrayList<Meeting> meetings;
	public final UserType type;
	public final ArrayList<Schedule> schedules;
	
	public User (String n, String e, ArrayList<Meeting> m, UserType ut, ArrayList<Schedule> s) {
		this.name = n;
		this.email = e;
		this.meetings = m;
		this.type = ut;
		this.schedules = s;
	}

}
