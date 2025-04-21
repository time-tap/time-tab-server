package com.sian.main.web;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sian.main.service.MainService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/main")
@RequiredArgsConstructor
public class MainRestController {

	private final String MY_CLASS_NAME = getClass().getName();
	private Logger logger = LoggerFactory.getLogger(getClass());

	private final MainService mainService;


}
