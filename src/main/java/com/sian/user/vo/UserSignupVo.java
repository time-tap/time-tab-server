package com.sian.user.vo;

import org.apache.ibatis.type.Alias;

import lombok.Data;

@Data
@Alias("userSignup")
public class UserSignupVo {
	private String userId;
	private String userPw;
	private String userNm;
	private String userTel;
	private String userPosition;
	private String userBirth;
}
