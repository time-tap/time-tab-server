package com.sian.common.page.service;

import org.springframework.stereotype.Service;

import com.sian.common.page.vo.PageVo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PageService {

	public PageVo getPage(int currentPage, int pageSize, int size) {
		// 현재 페이지 currentPage
		// 페이지당 보여줄 데이터 수 pageSize
		int totalRecords = size; // 전체 데이터 수

		// 전체 페이지 수 계산
		int totalPages = (totalRecords + pageSize - 1) / pageSize;

		// 현재 페이지 그룹 계산
		int displayPageCount = 5; // 1 ~ 5, 6 ~ 10과 같은 페이지 그룹 크기
		int currentGroup = (int) Math.ceil((double) currentPage / displayPageCount);
		int startPage = (currentGroup - 1) * displayPageCount + 1;
		int endPage = Math.min(currentGroup * displayPageCount, totalPages);

		// 이전/다음 버튼 활성화 여부
		boolean hasPrev = startPage > 1;
		boolean hasNext = endPage < totalPages;

		return new PageVo(currentPage, pageSize, totalRecords, totalPages, startPage, endPage, hasPrev, hasNext,
				displayPageCount);
	}

}
