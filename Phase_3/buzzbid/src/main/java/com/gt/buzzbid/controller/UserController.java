package com.gt.buzzbid.controller;

import com.gt.buzzbid.entity.User;
import com.gt.buzzbid.response.AuthResponse;
import com.gt.buzzbid.security.config.JwtProvider;
import com.gt.buzzbid.service.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class UserController {
    @Autowired
    private UserServiceImpl userServiceImpl;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody User userRequest) {
        AuthResponse response = new AuthResponse();
        String username = userRequest.getUsername();

        UserDetails existingUser = userServiceImpl.getUserByUsername(username);

        if (existingUser != null) {
            response.setMessage("Username is already registered. Please log in to continue.");
            response.setSuccess(false);

            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        User newUser = new User();
        newUser.setUsername(username);
        newUser.setPassword(userRequest.getPassword());
        newUser.setFirstName(userRequest.getFirstName());
        newUser.setLastName(userRequest.getLastName());

        userServiceImpl.saveUser(newUser);

        Authentication authResponse = new UsernamePasswordAuthenticationToken(username, userRequest.getPassword());
        SecurityContextHolder.getContext().setAuthentication(authResponse);

        response.setToken(JwtProvider.generateToken(authResponse));
        response.setMessage("Registered successfully!");
        response.setSuccess(true);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody User loginRequest) {
        AuthResponse response = new AuthResponse();
        Authentication authModel = authenticate(loginRequest.getUsername(), loginRequest.getPassword());

        if (authModel.getPrincipal() == null) {
            response.setMessage("Invalid username or password. Please try again.");
            response.setSuccess(false);

            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        SecurityContextHolder.getContext().setAuthentication(authModel);

        response.setMessage("Logged in successfully");
        response.setToken(JwtProvider.generateToken(authModel));
        response.setSuccess(true);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    private Authentication authenticate(String username, String password) {
        UserDetails userDetails = userServiceImpl.getUserByUsername(username);

        if (userDetails == null) {
            return new UsernamePasswordAuthenticationToken(null, null, null);
        }

        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            return new UsernamePasswordAuthenticationToken(null, null, null);
        }

        return new UsernamePasswordAuthenticationToken(userDetails, null, null);
    }
}