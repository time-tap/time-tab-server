package com.sian.config.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sian.login.vo.UserLoginVo;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import javax.servlet.http.*;
import java.io.IOException;

public class JsonUsernamePasswordAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

	private final ObjectMapper objectMapper = new ObjectMapper();

	public JsonUsernamePasswordAuthenticationFilter(AuthenticationManager authenticationManager) {
		super.setAuthenticationManager(authenticationManager);
		setFilterProcessesUrl("/loginProcess");
	}

	@Override
	public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
			throws AuthenticationException {

		try {
			UserLoginVo userLogin = objectMapper.readValue(request.getInputStream(), UserLoginVo.class);
			UsernamePasswordAuthenticationToken authRequest = new UsernamePasswordAuthenticationToken(
					userLogin.getUsername(), userLogin.getPassword());

			return this.getAuthenticationManager().authenticate(authRequest);
		} catch (IOException e) {
			throw new AuthenticationServiceException("JSON 로그인 파싱 오류", e);
		}
	}
}
