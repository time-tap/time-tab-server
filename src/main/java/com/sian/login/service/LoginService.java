package com.sian.login.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.userdetails.jdbc.JdbcDaoImpl;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sian.auth.service.AuthService;
import com.sian.login.mapper.LoginMapper;
import com.sian.login.vo.UserLoginVo;

import lombok.RequiredArgsConstructor;

@Service("loginService")
@Transactional
public class LoginService extends JdbcDaoImpl implements UserDetailsService {

	private Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private LoginMapper loginMapper;

	@Autowired
	private AuthService authService;

	@Autowired
	public LoginService(DataSource dataSource) {
		// TODO Auto-generated constructor stub
		super.setDataSource(dataSource);
	}

	/**
	 * Security 로그인
	 */
	@Override
	public UserDetails loadUserByUsername(String id) throws UsernameNotFoundException {
		UserLoginVo user = null;
		logger.info("로그인 시도: 사용자 ID = " + id);

		try {
			// 사용자 정보 담을 객체 생성
			UserLoginVo userParam = new UserLoginVo();
			userParam.setUserId(id);

			// DB에서 사용자 정보 조회
			user = loginMapper.loginUser(userParam);

			if (user == null || user.getUsername() == null) {
				logger.warn("사용자 정보를 찾을 수 없습니다: ID = " + id);
				throw new UsernameNotFoundException("사용자 정보를 찾을 수 없습니다: ID = " + id);
			}

		} catch (Exception e) {
			logger.error("로그인 처리 중 오류 발생: ID = " + id, e);
		}

		return user;
	}

	@Override
	protected List<GrantedAuthority> loadUserAuthorities(String username) {

		UserLoginVo userParam = new UserLoginVo();
		userParam.setUserId(username);
		UserLoginVo user = loginMapper.loginUser(userParam);

		List<GrantedAuthority> list = new ArrayList<GrantedAuthority>();

		String authName = "user";
		list.add(new SimpleGrantedAuthority("ROLE_" + authName.toUpperCase()));

		return list;
	}

	@Override
	protected List<GrantedAuthority> loadGroupAuthorities(String username) {
		return super.loadGroupAuthorities(username);
	}

	/**
	 * 권한 설정
	 *
	 * @param user
	 */
	public List<GrantedAuthority> setUserAuthorities(UserLoginVo user) {
		List<GrantedAuthority> dbAuths = new ArrayList<>(); // 권한 리스트 생성

//		String userIdx = user.getUserIdx(); // 사용자 인덱스
//		
//		String userTp = user.getUserTp(); // 사용자 타입
//
//		if (userTp.equals("USRTP001")) { // 관리자 타입 => DB 조회 후 권한 부여
//			logger.info("사용자 타입: 관리자");
//			
//			List<String> authList = authService.getUserAuth(userIdx);
//			for (String auth : authList) {
//				dbAuths.add(new SimpleGrantedAuthority(auth.toUpperCase()));
//			}
//		} else if (userTp.equals("USRTP002")) { // 일반 유저 => 바로 유저 권한 부여
//			logger.info("사용자 타입: 일반 사용자");
//	        dbAuths.add(new SimpleGrantedAuthority("ROLE_USER"));
//		} else {
//	        logger.warn("알 수 없는 사용자 타입: " + userTp);
//	    }
//
//		if (dbAuths.isEmpty()) {
//	        logger.warn("사용자에게 부여된 권한이 없습니다: ID = " + user.getUserId());
//	        throw new UsernameNotFoundException("사용자에게 권한이 없습니다: ID = " + user.getUserId());
//	    }
//
//	    logger.info("부여된 권한: " + dbAuths);

		return dbAuths;
	}

	/**
	 * 스프링 시큐리티 세션 값 수정 (내 정보 수정 시 세션도 수정해줘야 하기 때문)
	 *
	 * @author 정재훈
	 * @version 2020-05-04
	 */
	protected Authentication createNewAuthentication(Authentication currentAuth, String userId) {

		UserDetails newPrincipal = loadUserByUsername(userId);

		UsernamePasswordAuthenticationToken newAuth = new UsernamePasswordAuthenticationToken(newPrincipal,
				currentAuth.getCredentials(), newPrincipal.getAuthorities());

		newAuth.setDetails(currentAuth.getDetails());

		return newAuth;
	}
}
