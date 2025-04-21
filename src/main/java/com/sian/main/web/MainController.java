package com.sian.main.web;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class MainController {
	
	// 루트 매핑
	@GetMapping(value = "/")
	public String root(Model model) throws Exception {
	    return "home/home";
	}
	
}

