package com.sian.auth.service;

import org.springframework.stereotype.Service;

import com.sian.auth.mapper.AuthMapper;
import lombok.RequiredArgsConstructor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RequiredArgsConstructor
@Service()
public class AuthService {

	private final AuthMapper authMapper;

	private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

}
