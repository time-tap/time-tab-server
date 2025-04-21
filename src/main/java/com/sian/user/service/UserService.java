package com.sian.user.service;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import com.sian.user.mapper.UserMapper;
import com.sian.user.vo.UserSignupVo;

@RequiredArgsConstructor
@Service()
public class UserService {

	private Logger logger = LoggerFactory.getLogger(getClass());

	private final UserMapper userMapper;
	
	private final PasswordEncoder passwordEncoder;

	public Map<String, Object> signup(UserSignupVo userSignupVo) {
		
		Map<String, Object> res = new HashMap<>();
		
		try {
	        // 비밀번호 암호화
	        String encodedPw = passwordEncoder.encode(userSignupVo.getUserPw());
	        userSignupVo.setUserPw(encodedPw);

	        // 회원가입 처리
	        userMapper.signup(userSignupVo);

	        res.put("code", 200);
	        res.put("message", "회원가입에 성공했어요.");
	    } catch (DuplicateKeyException e) {
	        res.put("code", 409);
	        res.put("message", "이미 존재하는 아이디예요.");
	    } catch (Exception e) {
	        res.put("code", 500);
	        res.put("message", "회원가입 중 오류가 발생했어요.");
	    }
		
		return res;
	}

}
