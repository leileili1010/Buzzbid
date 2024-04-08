package com.gt.buzzbid.service.user;

import com.gt.buzzbid.entity.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;

public interface UserService {
    public UserDetails getUserByUsername(String username);
    public void saveUser(User user);
}
