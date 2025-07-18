package com.example.spends_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SpendsServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpendsServiceApplication.class, args);
	}

}
