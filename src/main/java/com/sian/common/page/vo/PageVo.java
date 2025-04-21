package com.sian.common.page.vo;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Alias("pageVo")
public class PageVo {
	private int currentPage;		// 현재 페이지 번호
	private int pageSize;			// 한 페이지에 보여줄 데이터 수
	private int totalRecords;		// 전체 데이터 수
	private int totalPages;			// 전체 페이지 수
	private int startPage;			// 현재 페이지 그룹의 시작 페이지 번호
	private int endPage;			// 현재 페이지 그룹의 끝 페이지 번호
	private boolean hasPrev;		// 이전 페이지 그룹 존재 여부
	private boolean hasNext;		// 다음 페이지 그룹 존재 여부
	private int displayPageCount; 	// 페이지 그룹 크기
}
