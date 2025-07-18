package com.example.user_service.controller;
import com.example.user_service.config.JwtUtil;
import com.example.user_service.model.User;
import com.example.user_service.repository.UserRepository;
import com.example.user_service.service.UserService;
import io.jsonwebtoken.Jwt;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.*;
import java.util.Optional;


@RestController
@RequestMapping("/api")
public class UserController {
    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    @Autowired
    private UserRepository userRepository;
    public UserController(UserService userService, JwtUtil jwtUtil){
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        System.out.println(user.getUsername());
        if (userService.existsByUsername(user.getUsername())) {
            return ResponseEntity.status(409).body("Username is already taken.");
        }
        userService.registerUser(user);
        return ResponseEntity.status(201).body("User Successfully Created");
    }

    @PutMapping("/password")
    public ResponseEntity<?> updatePassword(@RequestBody Map<String, String> payload,
                                            HttpServletRequest request) {
        String username = (String) request.getAttribute("username");
        if (username == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        String oldPassword = payload.get("oldPassword");
        String newPassword = payload.get("newPassword");

        if (oldPassword == null || newPassword == null || oldPassword.isBlank() || newPassword.isBlank()) {
            return ResponseEntity.badRequest().body("Both old and new passwords are required");
        }

        boolean success = userService.updatePassword(username, oldPassword, newPassword);

        if (success) {
            return ResponseEntity.ok("Password updated successfully");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Incorrect old password");
        }
    }

    @PutMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String newPassword = body.get("newPassword");

        if (username == null || newPassword == null || username.isBlank() || newPassword.isBlank()) {
            return ResponseEntity.badRequest().body("Username and new password are required");
        }

        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        User user = optionalUser.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok("Password reset successful");
    }


        @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        Optional<User> authenticatedUser = userService.loginUser(user.getName(),user.getUsername(), user.getPassword());

        return authenticatedUser.map(u -> {

            String token = jwtUtil.generateToken(u.getUsername());
            Map<String, Object> response = new HashMap<>();
            response.put("userName", u.getUsername());
            response.put("name", u.getName());
            response.put("token", token);
            response.put("message", "login success");

            return ResponseEntity.ok(response);
        }).orElseGet(()-> {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Invalid credentials");
            return ResponseEntity.status(401).body(error);
        });
        }


    @GetMapping("/profile")
    public ResponseEntity<User> getProfile( HttpServletRequest request) {
        User user = userRepository.findByUsername((String) request.getAttribute("username")).orElseThrow();
        System.out.println("profile:::"+(String) request.getAttribute("username"));
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody User updatedUser, HttpServletRequest request) {
        User user = userRepository.findByUsername((String) request.getAttribute("username")).orElseThrow();
        System.out.println(user.getId());
        user.setName(updatedUser.getName());
        user.setDateOfBirth(updatedUser.getDateOfBirth());
        user.setGender(updatedUser.getGender());
        user.setMonthlyIncome(updatedUser.getMonthlyIncome());
        user.setInvestmentGoal(updatedUser.getInvestmentGoal());

        boolean complete = user.getName() != null && user.getGender() != null && !user.getGender().isEmpty()
                && user.getDateOfBirth() != null && user.getMonthlyIncome() != null
                && user.getInvestmentGoal() != null;

        user.setProfileComplete(complete);
        userRepository.save(user);

        return ResponseEntity.ok().build();
    }


}



