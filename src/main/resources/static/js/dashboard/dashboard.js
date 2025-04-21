
overview();

// 회원 통계 가져오는 api
function overview() {
	$.ajax({
		url: '/admin/api/dashboard/overview',
		method: 'GET',
		success: function(response) {
			console.log('대시보드 통계: ', response);
			updateDashboardUI(response);
		},
		error: function(error) {
			console.error('회원 통계 가져오기 실패:', error);
		}
	});
}

// 화면 업데이트 함수
function updateDashboardUI(data) {
	// 회원 통계 처리
	data.userStats.forEach(function(stat) {
		$('#user-total-' + stat.userTp).text(formatNumber(stat.userCnt));
        $('#user-today-' + stat.userTp).text(formatNumber(stat.userTodayCnt));
	});
	
	// 방문자수
	$('#visit-total').text(formatNumber(data.visitorStats.totalCnt));
	$('#visit-week').text(formatNumber(data.visitorStats.weekCnt));
	$('#visit-today').text(formatNumber(data.visitorStats.todayCnt));
	
	// 자문 요청 통계 처리
	data.adviseStats.forEach(function(stat) {
		$('#advise-pending-' + stat.userTp).text(formatNumber(stat.pendingCnt));
        $('#advise-in-progress-' + stat.userTp).text(formatNumber(stat.inProgressCnt));
		$('#advise-delete-wait-' + stat.userTp).text(formatNumber(stat.deleteWaitCnt));
		$('#advise-completed-' + stat.userTp).text(formatNumber(stat.completedCnt));
	});
}

// 회원 통계 버튼 클릭
$('#section1-title-btn').click(function() {
	window.location.href = '/admin/dashboardUser';
});

// 엑셀 추출 버튼 (회원 통계)
$('#excel-btn').click(function() {
	
	const date = $('#month-calendar').val(); // 서버 요청할 날짜
	
	if (date == null || date == '') {
		alert('년월을 선택해주세요.');
		return;
	}
	
	window.location.href = '/admin/api/excel/download?date=' + date;
	
});

// 년월 달력 모달
$('#month-calendar').monthCalendar({
	startYear: 2024,
	endYear: 2025
});





