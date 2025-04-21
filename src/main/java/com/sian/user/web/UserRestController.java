package com.sian.user.web;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sian.user.service.UserService;
import com.sian.user.vo.UserSignupVo;

import java.util.HashMap;
import java.util.Map;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserRestController {

	private Logger logger = LoggerFactory.getLogger(getClass());

	private final UserService userService;

	/*
	 * 이민웅 test 123123df
	 */

	@PostMapping("/signup")
	public ResponseEntity<Map<String, Object>> signup(@RequestBody UserSignupVo userSignupVo) {

		// 입력값 누락 검사
		if (userSignupVo.getUserId() == null || userSignupVo.getUserId().trim().isEmpty()
				|| userSignupVo.getUserPw() == null || userSignupVo.getUserPw().trim().isEmpty()
				|| userSignupVo.getUserNm() == null || userSignupVo.getUserNm().trim().isEmpty()
				|| userSignupVo.getUserTel() == null || userSignupVo.getUserTel().trim().isEmpty()
				|| userSignupVo.getUserPosition() == null || userSignupVo.getUserPosition().trim().isEmpty()) {
			Map<String, Object> res = new HashMap<>();
			res.put("code", 400);
			res.put("message", "필수 입력값이 누락되었어요.");
			return ResponseEntity.badRequest().body(res);
		}

		Map<String, Object> res = userService.signup(userSignupVo);

		int code = (int) res.get("code");

		return ResponseEntity.status(code == 200 ? HttpStatus.OK
				: code == 400 ? HttpStatus.BAD_REQUEST
						: code == 409 ? HttpStatus.CONFLICT : HttpStatus.INTERNAL_SERVER_ERROR)
				.body(res);
	}

}
