package com.sian.login.service;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.RedirectStrategy;
import org.springframework.security.web.WebAttributes;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.savedrequest.HttpSessionRequestCache;
import org.springframework.security.web.savedrequest.RequestCache;
import org.springframework.security.web.savedrequest.SavedRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sian.login.mapper.LoginMapper;
import com.sian.login.vo.UserLoginVo;



@Component
public class LoginSuccessHandler implements AuthenticationSuccessHandler {

	private Logger logger = LoggerFactory.getLogger(getClass());

	private RequestCache requestCache = new HttpSessionRequestCache();
	private String targetUrlParameter;
	private String defaultUrl;
	private boolean useReferer;
	private RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();

//	private HttpSession session;

	@Autowired
	private LoginMapper authMapper;

	public LoginSuccessHandler(){

		targetUrlParameter = "";
		defaultUrl = "/";
		useReferer = false;
	}

	public String getTargetUrlParameter() {
		return targetUrlParameter;
	}

	public void setTargetUrlParameter(String targetUrlParameter) {
		this.targetUrlParameter = targetUrlParameter;
	}

	public String getDefaultUrl() {
		return defaultUrl;
	}

	public void setDefaultUrl(String defaultUrl) {
		this.defaultUrl = defaultUrl;
	}

	public boolean isUseReferer() {
		return useReferer;
	}

	public void setUseReferer(boolean useReferer) {
		this.useReferer = useReferer;
	}

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
    	// 유저 정보 조회
    	UserLoginVo user = (UserLoginVo) authentication.getPrincipal();
    	
    	// 성공 결과 저장
    	Map<String, Object> result = new HashMap<>();
    	result.put("message", "로그인 성공");
    	result.put("code", 200);
    	
    	// 유저 정보 생성
    	Map<String, Object> userMap = new HashMap<>();
    	userMap.put("userIdx", user.getUserIdx());
    	userMap.put("userId", user.getUsername());
    	userMap.put("name", user.getUserNm());
    	
    	// 유저 정보 저장
    	result.put("user", userMap);

    	ObjectMapper mapper = new ObjectMapper();
    	String json = mapper.writeValueAsString(result);

    	logger.info("로그인 응답 JSON: " + json);

    	response.setStatus(HttpServletResponse.SC_OK);
    	response.setContentType("application/json;charset=UTF-8");
    	response.getWriter().write(json);

    }

	private void clearAuthenticationAttributes(HttpServletRequest request) {
        HttpSession session = request.getSession(false);

        if (session == null) {
            return;
        }

        session.removeAttribute(WebAttributes.AUTHENTICATION_EXCEPTION);
    }

	private String useTargetUrl(HttpServletRequest request, HttpServletResponse response) throws IOException{
		SavedRequest savedRequest = requestCache.getRequest(request, response);
		if(savedRequest != null){
			requestCache.removeRequest(request, response);
		}
		String targetUrl = request.getParameter(targetUrlParameter);
		//redirectStrategy.sendRedirect(request, response, targetUrl);

		return targetUrl;
	}

	private String useSessionUrl(HttpServletRequest request, HttpServletResponse response) throws IOException{
		SavedRequest savedRequest = requestCache.getRequest(request, response);
		String targetUrl = savedRequest.getRedirectUrl();
		//redirectStrategy.sendRedirect(request, response, targetUrl);

		return targetUrl;
	}

	private String useRefererUrl(HttpServletRequest request, HttpServletResponse response) throws IOException{
		String targetUrl = request.getHeader("REFERER");
		targetUrl = defaultUrl;
		//redirectStrategy.sendRedirect(request, response, targetUrl);

		return targetUrl;
	}

	private String usePreUrl(HttpServletRequest request, HttpServletResponse response) throws IOException{
		String targetUrl = request.getHeader("PREPAGE");
		//redirectStrategy.sendRedirect(request, response, targetUrl);

		return targetUrl;
	}

	private String useDefaultUrl(HttpServletRequest request, HttpServletResponse response) throws IOException{
		//redirectStrategy.sendRedirect(request, response, defaultUrl);
		return defaultUrl;
	}

	private int decideRedirectStrategy(HttpServletRequest request, HttpServletResponse response){
		int result = 0;
		SavedRequest savedRequest = requestCache.getRequest(request, response);

		if(!"".equals(targetUrlParameter)){
			String targetUrl = request.getParameter(targetUrlParameter);
			if(StringUtils.hasText(targetUrl)){
				result = 1;
			}else{
				if(savedRequest != null){
					result = 2;
				}else{
					String refererUrl = request.getHeader("REFERER");
					if(useReferer && StringUtils.hasText(refererUrl)){
						result = 3;
					} else {
						result = 0;
					}
				}
			}

			return result;
		}

		if(savedRequest != null){
			result = 2;
			return result;
		}

		String refererUrl = request.getHeader("REFERER");
		if(useReferer && StringUtils.hasText(refererUrl)){
			result = 3;
			return result;
		}else{
			result = 0;
		}

		return result;
	}

	private int utilIndexOf(String header, String word) {
		return org.apache.commons.lang3.StringUtils.indexOf(header, word);
	}
}
