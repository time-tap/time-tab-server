package com.sian.login.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.data.repository.query.Param;

import com.sian.login.vo.UserLoginVo;

@Mapper
public interface LoginMapper {

	public UserLoginVo loginUser(UserLoginVo user);
}
