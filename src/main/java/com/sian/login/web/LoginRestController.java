package com.sian.login.web;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.RequiredArgsConstructor;

@RequestMapping("/api/login")
@Controller
@RequiredArgsConstructor
public class LoginRestController {

	private Logger logger = LoggerFactory.getLogger(getClass());

}
