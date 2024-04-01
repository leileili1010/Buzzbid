package com.gt.buzzbid.db;

import org.springframework.util.CollectionUtils;

import java.sql.*;
import java.util.List;

public class DatabaseService {
    private final static String DB_URL = "jdbc:postgresql://localhost:5432/buzzbid";
    private final static String DB_DRIVER = "";
    private final static String USERNAME = "buzzbid";
    private final static String PASSWORD = "gtbuzzbid123";

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(DB_URL, USERNAME, PASSWORD);
    }
}
