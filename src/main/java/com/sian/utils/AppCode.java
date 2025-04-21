package com.sian.utils;

import com.fasterxml.jackson.annotation.JsonFormat;

/**
 * 상태 코드
 * 
 * @author Siansoft
 *
 */
@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum AppCode{

	SUCCESS("200","성공")
	, FAIL("300","실패")
	
	, UNAUTHORIZED("401","로그인 실패")
	, FORBIDDEN("403","권한 없음")
	, NOT_FOUND("404","잘못된 URL 요청")
	, NOT_SUPPORT("405","HTTP Method 불일치")
	
	, ERROR_REQUEST("500","요청 처리 오류")
	, ERROR_GET_DATA("501","DB 조회 요청 오류")
	, ERROR_SET_DATA("502","DB 변경 요청 오류")
	, ERROR_DUPLICATE("503","이미 등록된 정보")
	, ERROR_NULL_SET_DATA("504","변경 데이터 없음")
	, ERROR_NOT_FOUND_DATA("505","등록된 정보 없음")
	, ERROR_REG_DEVICE("506","기기 등록 실패")
	
	, ERROR_AWS("600","AWS 처리 요청 오류")
	, ERROR_AWS_TIMEOUT("601","AWS 응답 시간 초과 오류")
	, ERROR_AWS_GET_DATA("602","AWS 조회 요청 오류")
	, ERROR_AWS_SET_DATA("603","AWS 변경 요청 오류")
	
	;
	
	private String code;
	private String msg;
	
	public String getCode() {
		return code;
	}
	
	public String getMsg() {
		return msg;
	}
	
	AppCode(String code, String msg) {
		// TODO Auto-generated constructor stub
		this.code = code;
		this.msg = msg;
	}
	
}
