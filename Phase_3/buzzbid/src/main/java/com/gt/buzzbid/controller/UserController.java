package com.gt.buzzbid.controller;

import com.gt.buzzbid.entity.User;
import com.gt.buzzbid.model.AuthUserModel;
import com.gt.buzzbid.response.AuthResponse;
import com.gt.buzzbid.security.config.jwt.JwtProvider;
import com.gt.buzzbid.service.user.UserServiceImpl;
import io.micrometer.common.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

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

        response.setName(String.join(" ", newUser.getFirstName(), newUser.getLastName()));
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
        Collection<? extends GrantedAuthority> authorities = authModel.getAuthorities();
        GrantedAuthority authority = authorities != null ? authorities.stream().findFirst().orElse(null) : null;

        response.setUserRole(authority != null ? authority.getAuthority() : null);
        response.setToken(JwtProvider.generateToken(authModel));
        response.setSuccess(true);
        response.setAdmin(authModel.getAuthorities() != null
                && authModel.getAuthorities().stream().anyMatch(a -> StringUtils.isNotEmpty( a.getAuthority())));

        User user = userServiceImpl.getUserByName(((UserDetails) authModel.getPrincipal()).getUsername());
        response.setName(String.join(" ", user.getFirstName(), user.getLastName()));

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/current-user")
    public ResponseEntity<AuthUserModel> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        String username = authentication.getName(); // Get the username directly from authentication

        User user = userServiceImpl.getUserByName(username);
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        AuthUserModel authUserModel = new AuthUserModel();
        authUserModel.setUsername(user.getUsername());
        authUserModel.setFirstName(user.getFirstName());
        authUserModel.setLastName(user.getLastName());
        authUserModel.setPosition(user.getPosition());

        return new ResponseEntity<>(authUserModel, HttpStatus.OK);
    }
    private Authentication authenticate(String username, String password) {
        UserDetails userDetails = userServiceImpl.getUserByUsername(username);

        if (userDetails == null) {
            return new UsernamePasswordAuthenticationToken(null, null, null);
        }

        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            return new UsernamePasswordAuthenticationToken(null, null, null);
        }

        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }
}