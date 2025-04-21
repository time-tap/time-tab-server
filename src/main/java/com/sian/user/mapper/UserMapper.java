package com.sian.user.mapper;

import org.apache.ibatis.annotations.Mapper;
import com.sian.user.vo.UserSignupVo;

@Mapper
public interface UserMapper {

	public void signup(UserSignupVo userSignupVo);

}
