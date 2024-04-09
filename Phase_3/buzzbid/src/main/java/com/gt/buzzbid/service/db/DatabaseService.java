package com.gt.buzzbid.service.db;

import java.sql.*;

public class DatabaseService {
    private final static String DB_URL = "jdbc:postgresql://localhost:5432/buzzbid";
    private final static String USERNAME = "buzzbid";
    private final static String PASSWORD = "gtbuzzbid123";

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(DB_URL, USERNAME, PASSWORD);
    }
}
