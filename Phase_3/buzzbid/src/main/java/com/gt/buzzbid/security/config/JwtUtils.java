package com.gt.buzzbid.security.config;

public class JwtUtils {
    private final static String SECRET = "OdHZYLR1pH7zAo54nKD1PmRAwzEw6M6z";
    private final static String AUTH = "Authorization";

    public static String getSecret() {
        return SECRET;
    }

    public static String getAuth() {
        return AUTH;
    }
}