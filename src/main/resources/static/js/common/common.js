// 유저 타입명 반환 함수
function resultTp(type) {
	let resultTp = '';
	switch (type) {
		case 'USBTP001':
			resultTp = '근로자';
			break;
		case 'USBTP002':
			resultTp = '기업';
			break;
		case 'USBTP003':
			resultTp = '전문가(기업)';
			break;
		default: // 매칭되는 값이 없을 경우
			resultTp = '전문가(프리랜서)';
	}
	return resultTp;
}

// 유저 상태명 반환
function statusNm(statusCd) {
	let status = '';
	switch (statusCd) {
		case 'STTCD001':
			status = '활성';
			break;
		case 'STTCD003':
			status = '일시 중지';
			break;
		default:
			status = '알 수 없음';
	}
	return status;
}

// 자문 상태명 반환
function adviseStatusNm(adviseStatusCd) {
	let status = '';
	switch (adviseStatusCd) {
		case 'ASTCD001':
			status = '요청';
			break;
		case 'ASTCD002':
			status = '진행';
			break;
		case 'ASTCD003':
			status = '완료';
			break;
		case 'ASTCD004':
			status = '삭제 대기';
			break;
		default:
			status = '알 수 없음';
	}
	return status;
}

// 로딩 상태 표시
function showLoading() {
	$('#loading-spinner').show();
}

// 로딩 상태 숨기기
function hideLoading() {
	$('#loading-spinner').hide();
}

// 숫자 포맷팅 함수 (','처리)
function formatNumber(number) {
	return number.toLocaleString();
}

// YYYY-MM-DD 형식으로 변환하는 함수
function formatDate(dateString) {
	// 날짜 문자열을 Date 객체로 변환
	var date = new Date(dateString);

	// 연도, 월, 일 추출
	var year = date.getFullYear();
	var month = ("0" + (date.getMonth() + 1)).slice(-2); // 월은 0부터 시작하므로 +1 필요
	var day = ("0" + date.getDate()).slice(-2);

	// YYYY-MM-DD 형식으로 반환
	return year + "-" + month + "-" + day;
}

// YYYY-MM-DD HH:mm 형식으로 변환하는 함수
function formatDateTime(dateString) {
	// 날짜 문자열을 Date 객체로 변환
	var date = new Date(dateString);

	// 연도, 월, 일 추출
	var year = date.getFullYear();
	var month = ("0" + (date.getMonth() + 1)).slice(-2); // 월은 0부터 시작하므로 +1 필요
	var day = ("0" + date.getDate()).slice(-2);

	// 시간, 분 추출
	var hours = ("0" + date.getHours()).slice(-2);
	var minutes = ("0" + date.getMinutes()).slice(-2);

	// YYYY-MM-DD HH:mm 형식으로 반환
	return year + "년 " + month + "월 " + day + "일 " + hours + ":" + minutes;
}

// HTML 특수 문자 이스케이프 함수
function escapeHtml(text) {
    return text.replace(/[&<>"']/g, function (match) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[match];
    });
}

// 페이지 넘버링 업데이트
function pagination(pageInfo) {
	const { currentPage, totalPages, startPage, endPage, hasPrev, hasNext, totalRecords} = pageInfo;
	
	$('#result-cnt').text(totalRecords);

	// 화살표 버튼 상태 및 data-page 설정
	$('#start-page')
		.attr('data-page', 1) // 항상 첫 페이지
		.prop('disabled', currentPage === 1) // 첫 페이지면 비활성화
		.toggleClass('active', currentPage !== 1); // 활성화 상태 설정

	$('#pre-page')
		.attr('data-page', hasPrev ? startPage - 1 : 1) // 이전 페이지 그룹의 끝 페이지
		.prop('disabled', !hasPrev) // 이전 페이지 그룹이 없으면 비활성화
		.toggleClass('active', hasPrev); // 활성화 상태 설정

	$('#next-page')
		.attr('data-page', hasNext ? endPage + 1 : totalPages) // 다음 페이지 그룹의 첫 번째 페이지
		.prop('disabled', !hasNext) // 다음 페이지 그룹이 없으면 비활성화
		.toggleClass('active', hasNext); // 활성화 상태 설정

	$('#end-page')
		.attr('data-page', totalPages) // 항상 마지막 페이지
		.prop('disabled', currentPage === totalPages) // 마지막 페이지면 비활성화
		.toggleClass('active', currentPage !== totalPages); // 활성화 상태 설정

	// 3. 페이지 번호 버튼 생성
	const $pageNumContainer = $('#page-num-container');
	$pageNumContainer.empty();

	for (let i = startPage; i <= endPage; i++) {
		const $btn = $(`<button class="page-btn" data-page="${i}"><span>${i}</span></button>`);
		$btn.data('page', i);

		if (i === currentPage) {
			$btn.addClass('active'); // 현재 페이지 강조
		}

		$pageNumContainer.append($btn);
	}
}

