package com.sian.utils;

import java.util.HashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;

public class ResponseMsg {

	private Logger logger = LoggerFactory.getLogger(getClass());

	private AppCode result = AppCode.FAIL;
	private HashMap<String, Object> data = new HashMap<>();
	private String msg;

	/**
	 * 결과 코드 설정
	 * 
	 * @param result AppCode
	 */
	public void setResult(AppCode result) {
		this.result = result;
	}

	/**
	 * Data 추가
	 * 
	 * @param key  String
	 * @param data Object
	 */
	public void setData(String key, Object data) {
		this.data.put(key, data);
	}

	public String getMsg() {
		return msg;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}

	public AppCode getResult() {
		return result;
	}

	public Object getData() {
		return data;
	}

	/**
	 * Data를 JSON String 형태로 변환
	 * 
	 * @return
	 */
	public String send() {
		String sendMsg = null;
		try {
			if (data.size() == 0) {
				data = null;
			}

			ObjectMapper objectMapper = new ObjectMapper();
			objectMapper.setSerializationInclusion(JsonInclude.Include.NON_EMPTY);
			sendMsg = objectMapper.writeValueAsString(this);
		} catch (Exception e) {
			// TODO: handle exception
		}

		logger.info("SEND : " + sendMsg);

		return sendMsg;
	}

}
