// 오늘 날짜 가져오기
let today = moment();
let startOfWeek = moment().subtract(6, 'days'); // 1주일 전 (오늘 포함)
let startOfMonth = moment().subtract(1, 'months'); // 1개월 전
let startOfYear = moment("2024-01-01"); // 2024년 1월 1일 (전체)

// 검색 조건 객체 초기화
let searchFilter = {
	keyword: null,
	regDtRange: [startOfYear.format('YYYY-MM-DD'), today.format('YYYY-MM-DD')], // 회원가입일 조건
	types: [], // 회원 유형 조건
	pageSize: 10, // 기본 10개씩 검색
	currentPage: 1, // 현재 페이지 넘버 (기본 1)
	statusCd: null
};

// 초기화: 각 열의 width를 data-width 값으로 설정
$("#result-head .result-head-column").each(function() {
	const width = $(this).data("width"); // data-width 값 읽기
	if (width) {
		$(this).css("width", width); // 열 초기 width 설정
	}
});



// 결과창 길이 조절 이벤트
let isResizing = false; // 드래그 중인지 여부
let currentColumn; // 현재 열
let startX, startWidth; // 드래그 시작 위치와 초기 열 너비

// .resizer에 mousedown 이벤트를 등록
$(".resizer").on("mousedown", function(e) {
	isResizing = true; // 드래그 시작
	currentColumn = $(this).parent(); // 현재 열
	columnClass = currentColumn.attr("class").split(" ")[1]; // 열 클래스 가져오기
	startX = e.pageX; // 드래그 시작 시 마우스의 X 좌표
	startWidth = currentColumn.width(); // 현재 열의 초기 너비

	// mousemove와 mouseup 이벤트를 문서에 등록
	$(document).on("mousemove", resizeColumn);
	$(document).on("mouseup", stopResizing);
});

// 열 크기 조정 함수
function resizeColumn(e) {
	if (!isResizing) return; // 드래그 중이 아니면 실행하지 않음

	let dx = e.pageX - startX; // 드래그로 이동한 거리
	let newWidth = startWidth + dx; // 현재 열의 새 너비

	// 최소 너비를 70px로 제한
	if (newWidth > 70) {
		currentColumn.css("width", newWidth); // 현재 헤더 열의 너비 업데이트
		$(`#result-body .${columnClass}`).css("width", newWidth); // 데이터 열의 너비 동기화
	}
}

// 드래그 종료 함수
function stopResizing() {
	isResizing = false; // 드래그 종료
	$(document).off("mousemove", resizeColumn); // mousemove 이벤트 제거
	$(document).off("mouseup", stopResizing); // mouseup 이벤트 제거
}

// result body 헤더랑 너비 맞추기
function syncColumnWidths() {
	$("#result-head .result-head-column").each(function() {
		const width = $(this).outerWidth(true); // 현재 헤더 열의 너비 가져오기
		const columnClass = $(this).attr("class").split(" ")[1]; // 열 클래스 가져오기
		$(`#result-body .${columnClass}`).css("width", width); // 데이터 열의 너비 동기화
	});
}

// 기간설정 달력 (date range picker 라이브러리)
$('#date-range').daterangepicker({
	locale: {
		"separator": " ~ ",
		format: 'YYYY-MM-DD',
		daysOfWeek: ["일", "월", "화", "수", "목", "금", "토"],
		monthNames: [
			'1월', '2월', '3월',
			'4월', '5월', '6월',
			'7월', '8월', '9월',
			'10월', '11월', '12월'
		],
		"applyLabel": "확인",
		"cancelLabel": "취소"
	},
	showDropdowns: true, // 년월 드롭박스 설정
	minYear: 2024,
	maxYear: 2050,
	applyButtonClasses: 'applyButton',
	cancelButtonClasses: 'cancelButton'
}, function(start, end) {
	// 선택된 날짜를 라벨 텍스트로 변경
	$('.date-detail-label').text(start.format('YYYY-MM-DD') + ' ~ ' + end.format('YYYY-MM-DD'));
	searchFilter.regDtRange = $('.date-detail-label').text().split(' ~ ');
	// 다른 라디오 버튼 효과 비활성화
	$('.date-btn').removeClass('select');

	// 기간 선택 버튼 액티브 효과
	$('.date-detail-label').addClass('select');
});

$("#date-range").on('showCalendar.daterangepicker', function(ev, picker) {
	$(".yearselect").css("float", "left");
	$(".monthselect").css("float", "right");
	$(".cancelBtn").css("float", "right");
});

// 회원가입일 버튼 클릭 이벤트 (기간 설정 제외)
$('.date-btn').on('click', function() {

	let selectedRange = $(this).attr('data-range'); // data-range 값 가져오기
	let startDate, endDate = today; // 기본적으로 종료 날짜는 오늘

	// 선택한 버튼에 따라 시작 날짜 설정
	if (selectedRange === "today") {
		startDate = today;
	} else if (selectedRange === "week") {
		startDate = startOfWeek;
	} else if (selectedRange === "month") {
		startDate = startOfMonth;
	} else if (selectedRange === "all") {
		startDate = today;
	}

	// 선택한 버튼의 날짜 범위를 달력에 적용
	$('#date-range').data('daterangepicker').setStartDate(startDate);
	$('#date-range').data('daterangepicker').setEndDate(endDate);
	$('.date-detail-label').removeClass('select');
	$('.date-detail-label').text('시작일 ~ 종료일');

	// 다른 라디오 버튼 초기화
	$('.date-btn').removeClass('select');

	// 선택한 버튼 활성화 효과	
	$(this).addClass('select');

	if (selectedRange == 'all') {
		searchFilter.regDtRange = [startOfYear.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')];
	} else {
		searchFilter.regDtRange = [startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')];
	}
});

// 기간 설정 버튼 클릭 이벤트
$('label[for="date-detail"]').on('click', function() {
	$('#date-range').focus(); // 달력 라이브러리로 이동
})

// 회원 유형 "전체" 체크박스 클릭 이벤트
$('#type-all').on('change', function() {
	const isChecked = $(this).is(':checked');

	// 다른 체크박스들의 상태를 "전체" 체크박스와 동일하게 설정
	$('input[type=checkbox][name=type]').prop('checked', isChecked);

	// span 태그에 bold700 클래스 추가/제거
	$('.type-label-text').toggleClass('bold700', isChecked);

});

// 회원 유형 다른 체크박스 클릭 이벤트
$('input[type=checkbox][name=type]').on('change', function() {
	const checkboxIndex = $('input[type=checkbox][name=type]').index(this);
	// 현재 체크박스와 동일한 인덱스의 span 태그에 bold700 클래스 추가/제거
	$('.type-label-text').eq(checkboxIndex + 1).toggleClass('bold700', $(this).is(':checked'));

	// 모든 다른 체크박스가 체크되어 있는지 확인
	const allChecked = $('input[type=checkbox][name=type]').length === $('input[type=checkbox][name=type]:checked').length;

	// "전체" 체크박스의 상태를 업데이트
	$('#type-all').prop('checked', allChecked);
	$('.type-all-label .type-label-text').toggleClass('bold700', allChecked);
});

// 상태 체크 이벤트
$('input[type=radio][name=status]').on('change', function() {
	// 모든 라벨에서 bold700 제거
    $('.status-label-text').removeClass('bold700');
	
	// 현재 선택된 라디오 버튼의 label을 찾아 bold700 추가
    $(this).next('label').find('.status-label-text').addClass('bold700');
})

// 검색창에서 엔터키 입력
$('#search-input').keypress(function(event) {
	if (event.which === 13) {
		$("#search-btn").click();
	}
});

// 검색 버튼 클릭 이벤트
$('#search-btn').on('click', function() {
	
	//검색 필터 업데이트
	setSearchFilter();

	// 현재 페이지 1로
	searchFilter.currentPage = 1;

	// 검색 요청
	getUserList(searchFilter);
});

// 초기화 버튼 클릭 이벤트
$('#reset-btn').on('click', function() {

	// 검색창 비우기
	$('#search-input').val('');
	searchFilter.keyword = null;

	// 회원가입일 스타일 초기화
	$('.date-btn').removeClass('select');
	$('.date-label').removeClass('select'); // 모든 버튼 스타일 제거
	$(".date-btn[data-range='all']").addClass("select"); // "전체" 버튼 스타일 추가

	// 기간 설정 초기화
	$('.date-detail-label').removeClass('select');
	$('.date-detail-label').text('시작일 ~ 종료일');
	$('#date-range').data('daterangepicker').setStartDate(today);
	$('#date-range').data('daterangepicker').setEndDate(today);
	searchFilter.regDtRange = [startOfYear.format('YYYY-MM-DD'), today.format('YYYY-MM-DD')];

	// 회원 유형 체크박스 초기화 (모두 체크)
	$('#type-all').prop('checked', true); // "전체" 체크
	$('input[type=checkbox][name=type]').prop('checked', true); // 모든 유형 체크

	// 스타일 초기화
	$('.type-label-text').addClass('bold700'); // 모든 유형 bold 처리
	$('.type-all-label .type-label-text').addClass('bold700'); // "전체" bold 처리
	
	// 회원 상태 초기화 (전체 체크)
	$('#status-all').prop('checked', true);
	$('.status-label-text').removeClass('bold700');
	$('#status-all').next('label').find('.status-label-text').addClass('bold700');

	// 현재 페이지 1
	searchFilter.currentPage = 1;

	setSearchFilter();
	
	// 초기화 후 검색 요청
	getUserList(searchFilter)
});

// 갯수 클릭 이벤트
$('#count-list-btn').on('click', function() {
	$('.count-list-container').toggleClass('open');
});

// 갯수 선택 클릭 이벤트
$('.count').on('change', function() {

	// 선택된 input의 value 가져오기
	const selectedCount = $(this).val();
	$('#count-list-btn span:first-child').text(selectedCount + '개');

	// 현재페이지 1로
	searchFilter.currentPage = 1;

	// 갯수 선택하면 바로 재검색
	getUserList(searchFilter);
});

// 갯수 선택 창 닫기
$('.count-li label').on('click', function() {
	$('.count-list-container').removeClass('open');
})

// 갯수 버튼 밖에 클릭 시 닫기
$('#wrap').on('click', function(event) {
	// 클릭한 대상이 #count-list-btn, .count-list-container 또는 그 내부 요소가 아닐 경우만 실행
	if (!$(event.target).closest('#count-list-btn, .count-list-container').length) {
		$('.count-list-container').removeClass('open');
	}
});

// 전체 체크박스 이벤트 (이벤트 위임)
$('#result-container').on('change', '.user-all', function() {
	const isChecked = $(this).is(':checked');
	$('#result-body .user').prop('checked', isChecked);
});

// 개별 체크박스 이벤트 (이벤트 위임)
$('#result-container').on('change', '.user', function() {
	const total = $('#result-body .user').length; // 전체 체크박스 개수
	const checked = $('#result-body .user:checked').length; // 체크된 체크박스 개수
	// 모든 .user 체크박스가 체크되었는지 확인
	$('#result-head .user-all').prop('checked', total === checked);
});


// 각 회원 복구/중지 버튼 클릭 이벤트
$('#result-body').on('click', '.set-btn', function() {
	const userIdx = $(this).data('user-idx'); // 선택한 유저 인덱스
	const userId = $(this).data('user-id'); // 선택한 유저 아이디
	const userStatusCd = $(this).data('status') // 선택한 유저 상태


	// 설정할 회원 정보 저장 객체
	let userList = {
		userIdx: [userIdx],
		userId: [userId],
		statusCd: ''
	}

	// 중지 → 복구 코드 변경
	if (userStatusCd == 'STTCD003') {
		const activeType = 'recoverUserOne';
		showSendMail(userList, activeType);
		return;
	}

	// 복구 → 중지 코드 변경
	else if (userStatusCd == 'STTCD001') {
		const activeType = 'blockUserOne';
		showSendMail(userList, activeType);
		return;
	}
	
	else {
		alert('요청 타입이 올바르지 않습니다.');
		return;
	}

});

// 선택한 회원 복구/정지 버튼 클릭 이벤트
$('.all-btn').on('click', function() {

	// 선택된 체크박스를 가져옴
	const selectedUsers = $('#result-body .user:checked');

	if (selectedUsers.length === 0) {
		alert('회원을 선택하세요.');
		return;
	}
	
	// 요청 타입
	const activeType = $(this).data('active-type');
	
	// 설정할 회원 정보 저장 객체
	let userList = {
		userIdx: [],
		userId: [],
	}

	// 선택된 회원 목록을 반복 처리
	selectedUsers.each(function() {
		const userIdx = $(this).data('idx'); // 체크박스의 data-idx 속성에서 회원 idx 가져오기
		const userId = $(this).data('id');  // 체크박스의 data-id 속성에서 회원 id 가져오기

		// 객체에 추가
		userList.userIdx.push(userIdx);
		userList.userId.push(userId);
	});

	showSendMail(userList, activeType);
});

// 메일 전송 창 이벤트 감지
$(document).on('sendMailClosed', function() {
	$('#user-all').prop('checked', false);
    getUserList(searchFilter);
});

// 페이지 버튼 클릭 이벤트
$('#page-btn-container').on('click', '[data-page]', function() {
	searchFilter.currentPage = $(this).attr('data-page'); // 현재 페이지 설정 (선택한 페이지로)
	console.log('test', searchFilter.currentPage);

	// 검색 요청
	getUserList(searchFilter);
});


// 검색필터 업데이트
setSearchFilter();

// 페이지 진입시 검색 
getUserList(searchFilter); // 페이지 진입시 전체 검색 결과 출력

function setSearchFilter(){
	// 검색어 가져오기
	var keywordVal = $('#search-input').val().trim(); // 검색창 값 가져와 트림(trim) 처리
	if (keywordVal !== null && keywordVal !== '') {
		searchFilter.keyword = keywordVal; // 값이 있으면 searchFilter.keyword에 저장
	} else {
		searchFilter.keyword = null;
	}

	// 체크된 회원 유형 값 가져오기 (여러 개 선택 가능할 경우 배열로 설정)
	searchFilter.types = $('input[name="type"]:checked').map(function() {
		return $(this).val();
	}).get();

	// 체크된 회원 상태 값 가져오기
	if ($('#status-all').is(':checked')) {
		searchFilter.statusCd = null;
	} else {
		// status-all이 체크되지 않았을 경우, 체크된 name="status" 값만 가져옴
		searchFilter.statusCd = $('input[name="status"]:checked').val();
	}
}

// 검색 요청 함수
function getUserList(searchFilter) {

	// 로딩 스피너 표시
	showLoading();

	// 검색 갯수 조건 (10~100개)
	searchFilter.pageSize = $('input[name="count"]:checked').val();

	// 최종 검색 조건 확인
	console.log('검색 조건:', searchFilter);

	// api 요청
	$.ajax({
		url: '/admin/api/user/getUserList',
		method: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(searchFilter),
		success: function(response) {
			console.log('userList: ', response.userList);
			resultUpdate(response.userList); // 화면 업데이트
			pagination(response.pageInfo); // 페이지 넘버링 업데이트
			$('#user-all').prop('checked', false); // 결과창 전체 체크 버튼 해제
		},
		error: function(error) {
			console.log('error: ', error);
			$('#result-body').html(`
                <div class="error">
                    <p>검색에 실패했습니다. 다시 시도해주세요.</p>
                </div>
            `);
		},
		complete: function() {
			// 로딩 스피너 숨기기
			hideLoading();
		}
	});
}

// 검색결과 화면 업데이트 함수
function resultUpdate(userList) {
	var rawList = `
		<div id="loading-spinner" style="display: flex;">
		    <div class="spinner"></div>
		</div>
	`;
	if (userList && userList.length > 0) {
		// 검색 결과가 있을 경우
		userList.forEach(function(user, index) {
			rawList += resultRaw(user, index);
		});
	} else {
		// 검색 결과가 없을 경우
		rawList += `
            <div class="no-results">
                <p>검색결과가 없습니다.</p>
            </div>
        `;
	}

	// 검색 결과 리스트 업데이트
	$('#result-body').html(rawList);

	// 헤더와 데이터 열 동기화
	syncColumnWidths()
}

// 검색 결과 HTML
function resultRaw(user, index) {
	const startIndex = (searchFilter.currentPage - 1) * searchFilter.pageSize + 1;
	let resultRaw = `
		<div class="result-body-raw">
            <div class="result-body-column column1" style="width: 40px;">
                <input type="checkbox" name="user" class="user" data-id="${user.userId}" data-idx="${user.userIdx}">
            </div>
            <div class="result-body-column column2" style="width: 60px;">
                <span>${startIndex + index}</span>
            </div>
            <div class="result-body-column column3" style="width: 100px;">
                <span>${user.userId}</span>
            </div>
            <div class="result-body-column column4" style="width: 70px;">
                <span>${user.userNm}</span>
            </div>
            <div class="result-body-column column5" style="width: 90px;">
                <span>${resultTp(user.userTp)}</span>
            </div>
            <div class="result-body-column column6" style="width: 270px;">
                <span>${statusNm(user.statusCd)}</span>
            </div>
			<div class="result-body-column column7" style="width: 90px;">
                <span>${formatDate(user.regDt)}</span>
            </div>
            <div class="result-body-column column8" style="width: 130px;">
	`
	if (user.lastLoginDt != null) {
		resultRaw += `<span>${user.lastLoginDt}</span>`;
	} else {
		resultRaw += `<span>정보 없음</span>`;
	}
	resultRaw += `</div>
            <div class="result-body-column column9" style="width: 130px;">
	`;
	if (user.blockedDt != null) {
		resultRaw += `<span>${user.blockedDt}</span>`;
	} else {
		resultRaw += `<span></span>`;
	}
	

	resultRaw += `</div>
            <div class="result-body-column column10" style="width: 80px;">
	`;

	if (user.statusCd == 'STTCD001') {
		resultRaw += `<button class="set-btn stop-btn" data-user-idx="${user.userIdx}" data-user-id="${user.userId}" data-status="${user.statusCd}"><span class="red">중지</span></button>`;
	} else if (user.statusCd == 'STTCD003') {
		resultRaw += `<button class="set-btn active-btn" data-user-idx="${user.userIdx}" data-user-id="${user.userId}" data-status="${user.statusCd}"><span class="blue">복구</span></button>	`;
	}

	resultRaw += `
	        </div>
        </div>
	`;

	return resultRaw;
}
