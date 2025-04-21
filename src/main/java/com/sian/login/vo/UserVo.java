package com.sian.login.vo;


import java.io.Serializable;
import java.util.Collection;

import org.apache.ibatis.type.Alias;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import lombok.Data;

@Data
@Alias("user")
public class UserVo implements UserDetails, Serializable {
	
	private static final long serialVersionUID = 1L;

	private String userIdx;
	private String userId;
	private String userPw;
	private String createDate;
	private String userGroupIdx;
	private boolean autoLogin;
	private Collection<? extends GrantedAuthority> authorities;
	private String userNm;
	private String userHp;
	private String userGroupDesc;
	
	private String loginType;

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		// TODO Auto-generated method stub
		return authorities;
	}
	@Override
	public String getPassword() {
		// TODO Auto-generated method stub
		return userPw;
	}
	@Override
	public String getUsername() {
		// TODO Auto-generated method stub
		return userId;
	}
	@Override
	public boolean isAccountNonExpired() {
		// TODO Auto-generated method stub
		return true;
	}
	@Override
	public boolean isAccountNonLocked() {
		// TODO Auto-generated method stub
		return true;
	}
	@Override
	public boolean isCredentialsNonExpired() {
		// TODO Auto-generated method stub
		return true;
	}
	@Override
	public boolean isEnabled() {
		// TODO Auto-generated method stub
		return true;
	}
	
}
