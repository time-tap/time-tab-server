//package com.sian.auth.vo;
//
//
//import java.io.Serializable;
//import java.time.LocalDateTime;
//import java.util.ArrayList;
//import java.util.Arrays;
//import java.util.Collection;
//import java.util.List;
//
//import org.springframework.security.core.GrantedAuthority;
//import org.apache.ibatis.type.Alias;
//
//
//import lombok.Data;
//
//@Data
//@Alias("AuthVo")
//public class AuthVo  {
//	
//	private String authIdx; //권한 인덱스
//	private String authNm; // 권한 이름
//	private List<String> menuLink; // 메뉴 링크
//	
//	private String menuLinks; // 임시 저장용
//
//	
//	public void setMenuLinks(String menuLinks) {
//        this.menuLinks = menuLinks;
//        if (menuLinks != null) {
//            this.menuLink = Arrays.asList(menuLinks.split(","));
//        } else {
//            this.menuLink = new ArrayList<>();
//        }
//    }
//}
