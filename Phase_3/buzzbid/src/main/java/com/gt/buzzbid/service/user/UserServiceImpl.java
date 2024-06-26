package com.gt.buzzbid.service.user;

import com.gt.buzzbid.service.db.DatabaseService;
import com.gt.buzzbid.entity.User;
import io.micrometer.common.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDetails getUserByUsername(String username) {
        User user = null;
        String query = "SELECT * FROM \"User\" WHERE username = ?";
        Connection conn = null;
        ResultSet rs = null;

        try {
            conn = DatabaseService.getConnection();
            PreparedStatement stmt = conn.prepareStatement(query);

            stmt.setString(1, username);
            rs = stmt.executeQuery();

            while (rs.next()) {
                user = new User(rs.getString("username"), rs.getString("password"),
                        rs.getString("first_name"), rs.getString("last_name"), rs.getString("position"));
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            try {
                if (conn != null) {
                    conn.close();
                }

                if (rs != null) {
                    rs.close();
                }
            } catch (SQLException e) {

            }
        }

        if (user != null) {
            List<GrantedAuthority> roles = new ArrayList<>();

            if (StringUtils.isNotBlank(user.getPosition())) {
                roles.add(new SimpleGrantedAuthority(user.getPosition()));
            }

            return new org.springframework.security.core.userdetails.User(
                    user.getUsername(),
                    user.getPassword(),
                    roles);
        }

        return null;
    }

    @Override
    public User getUserByName(String username) {
        String query = "SELECT * FROM \"User\" WHERE username = ?";
        Connection conn = null;
        ResultSet rs = null;

        try {
            conn = DatabaseService.getConnection();
            PreparedStatement stmt = conn.prepareStatement(query);

            stmt.setString(1, username);
            rs = stmt.executeQuery();

            if (rs.next()) {
                return new User(rs.getString("username"), rs.getString("password"),
                        rs.getString("first_name"), rs.getString("last_name"), rs.getString("position"));
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            try {
                if (conn != null) {
                    conn.close();
                }

                if (rs != null) {
                    rs.close();
                }
            } catch (SQLException e) {

            }
        }

        return null;
    }
    @Override
    public void saveUser(User user) {
        String query = "INSERT INTO \"User\" VALUES (?, ?, ?, ?, null)";
        List<Object> params = new ArrayList<>();
        Connection conn = null;

        params.add(user.getUsername());
        params.add(passwordEncoder.encode(user.getPassword()));
        params.add(user.getFirstName());
        params.add(user.getLastName());

        try {
            conn = DatabaseService.getConnection();
            PreparedStatement stmt = conn.prepareStatement(query);
            int i = 1;

            for (Object param : params) {
                stmt.setObject(i, param);
                i++;
            }

            stmt.executeUpdate();
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            try {
                if (conn != null) {
                    conn.close();
                }
            } catch (SQLException e) {

            }
        }
    }
}