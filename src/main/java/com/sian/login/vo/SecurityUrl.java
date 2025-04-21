package com.sian.login.vo;

import org.apache.ibatis.type.Alias;
import org.springframework.http.HttpMethod;

import lombok.Data;

@Data
@Alias("secUrl")
public class SecurityUrl {
	private String programTp;
	private String programNm;
	private String userGroupIdx;
	private String link;
	
	public HttpMethod getHttpMethod() {
		HttpMethod method = HttpMethod.GET;
		
		switch (this.programTp) {
		case "PRGTP004": method = HttpMethod.POST; break;
		case "PRGTP005": method = HttpMethod.PUT; break;
		case "PRGTP006": method = HttpMethod.DELETE; break;
		}
		
		return method;
	}
}
