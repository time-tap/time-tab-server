// 오늘 날짜 가져오기
let today = moment();
let startOfWeek = moment().subtract(6, 'days'); // 1주일 전 (오늘 포함)
let startOfMonth = moment().subtract(1, 'months'); // 1개월 전
let startOfYear = moment("2024-01-01"); // 2024년 1월 1일 (전체)

// 검색 조건 객체 초기화
let searchFilter = {
	keyword: null,
	regDtRange: [startOfYear.format('YYYY-MM-DD'), today.format('YYYY-MM-DD')], // 공지사항 등록일 조건
	pageSize: 10, // 기본 10개씩 검색
	currentPage: 1, // 현재 페이지 넘버 (기본 1)
};

// 검색필터 업데이트
setSearchFilter();


// 검색 조건 객체 설정하는 함수
function setSearchFilter() {
	// 검색어 가져오기
	var keywordVal = $('#search-input').val().trim(); // 검색창 값 가져와 트림(trim) 처리
	if (keywordVal !== null && keywordVal !== '') {
		searchFilter.keyword = keywordVal; // 값이 있으면 searchFilter.keyword에 저장
	} else {
		searchFilter.keyword = null;
	}
}

// 메인 화면 노출 공지사항 검색
getTopBoard();

// 공지사항 리스트 검색
getBoardList(searchFilter);

//노출 중인 공지사항 리스트 요청 API
function getTopBoard() {

	// 로딩 스피너 출력
	showLoadingTop();

	$.ajax({
		url: '/admin/api/board/getTopBoard',
		method: 'POST',
		success: function(response) {
			console.log('getTopBoard response ', response);
			topBoardUpdate(response);
		},
		error: function() {
			console.log('ajax요청 에러')
		},
		complete: function() {
			hideLoadingTop();
		}
	});
}

// 노출 공지사항 화면 업데이트
function topBoardUpdate(data) {
	const boardList = data.boardList;

	let boardHtml = `
		<div id="top-board-spinner">
			<div id="loading-spinner" class="top">
				<div class="spinner"></div>
			</div>
		</div>
	`;

	if (boardList.length > 0) {
		boardList.forEach(function(board, index) {
			boardHtml += topBoardHtml(board, index);
		});

		// 공지사항 리스트 업데이트
		$('#section2-main').html(boardHtml);

		// innerHTML 적용 (공지사항 내용 렌더링)
		boardList.forEach((board) => {
			$(`#boardContent-${board.boardIdx}`).html(board.boardContent);
		});
	} else {
		boardHtml += `
			<div class="no-results top">
				노출중인 공지사항이 없습니다.
			</div>
		`;
		$('#section2-main').html(boardHtml);
	}

}

// 노출 중인 공지사항 HTML 
function topBoardHtml(board, index) {

	let boardHtml = `
		<div class="top-board-li">
			<div class="top-board num">
				<span>${index + 1}</span>
			</div>
			<div class="top-board title">
				<span>${board.boardTitle}</span>
			</div>
			<div class="top-board date">
				<span>${formatDate(board.regDt)}</span>
			</div>
			<div class="top-board set">
				<button class="top-board-set-btn" data-idx="${board.boardIdx}" data-set="up">
					<span class="top-board-up-arrow"></span>
				</button>
				<button class="top-board-set-btn" data-idx="${board.boardIdx}" data-set="down">
					<span class="top-board-down-arrow"></span>
				</button>
			</div>
			<div class="top-board info">
				<button class="info-btn" data-idx="${board.boardIdx}">
				 	<span class="blue">상세</span>
				</button>
			</div>
			<div class="top-board hide">
				<button class="hide-btn" data-idx="${board.boardIdx}">
					<span class="red">숨김</span>
				</button>
			</div>
		</div>
	`;

	return boardHtml;
}

// 메인 화면 노출 리스트에서 위, 아래 버튼 클릭(순서변경하기)
$('#section2-main').on('click', '.top-board-set-btn', function() {

	// 선택한 공지사항 인덱스
	const setIdx = $(this).data('idx');

	// 위, 아래 버튼 확인하기
	const setTp = $(this).data('set');

	// API 요청
	setBoard(setIdx, setTp);


});

// 공지사항 노출 순서 변경 API
function setBoard(setIdx, setTp) {
	$.ajax({
		url: '/admin/api/board/setBoard',
		method: 'POST',
		contentType: 'application/json',
		data: JSON.stringify({
			setIdx: setIdx,
			setTp: setTp
		}),
		success: function(response) {
			console.log(response.message);
			getTopBoard(); // 화면 업데이트
			getBoardList(searchFilter);
		},
		error: function() {
			console.log('setBoard AJAX 요청 실패');
		}
	});
}

// 메인 화면 출력 리스트에서 '숨김' 버튼 클릭
$('#section2-main').on('click', '.hide-btn', function() {	
	
	// 선택한 공지사항 인덱스
	const boardIdx = $(this).data('idx');
	
	console.log('숨김 처리할 공지사항 인덱스: ', boardIdx);
	
	hideBoard(boardIdx);
	
});

// 공지사항 숨기기 API
function hideBoard(boardIdx) {
	$.ajax({
		url: '/admin/api/board/hideBoard',
		method: 'POST',
		contentType: 'application/json',
		data: JSON.stringify({ boardIdx: boardIdx }),
		success: function(response) {
			alert(response.message);
			getTopBoard();
			getBoardList(searchFilter);
		},
		error: function() {
			console.log('AJAX 요청 실패');
		}
	});
}



// 공지사항 리스트 요청 API
function getBoardList() {

	// 로딩 스피너 출력
	showLoadingBoard();

	$.ajax({
		url: '/admin/api/board/getBoardList',
		method: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(searchFilter),
		success: function(response) {
			console.log('getBoardList response ', response);
			boardUpdate(response.boardList); // 공지사항 리스트 업데이트
			pagination(response.pageVo); // 페이지네이션 업데이트
		},
		error: function() {
			console.log('getBoardList AJAX 요청 에러');
		},
		complete: function() {
			// 로딩 스피너 숨기기
			hideLoadingBoard();
		}
	});
}

// 공지사항 리스트 업데이트
function boardUpdate(boardList) {
	let boardHtml = `
		<div id="board-li-spinner" style="display: none;">
        	<div id="loading-spinner">
	            <div class="spinner"></div>
	        </div>
        </div>	
	`;

	// 공지사항 리스트 html 추가
	if (boardList.length > 0) {
		boardList.forEach(function(board, index) {
			boardHtml += resultRaw(board, index);
		});
	} else {
		boardHtml += `
			<div class="no-results">
                <p>검색결과가 없습니다.</p>
            </div>
		`;
	}

	$('#result-body').html(boardHtml);
}

// 검색 결과 HTML
function resultRaw(board, index) {
	const startIndex = (searchFilter.currentPage - 1) * searchFilter.pageSize + 1;
	let resultRaw = `
		<div class="result-body-raw">
            <div class="result-body-column column1" style="width: 40px;">
                <input type="checkbox" name="board" class="board" data-id="${board.boardIdx}" data-idx="${board.boardIdx}">
            </div>
            <div class="result-body-column column2" style="width: 60px;">
                <span>${startIndex + index}</span>
            </div>
            <div class="result-body-column column3" style="width: 80px;">
	`;
	// 노출중인 공지사항 처리
	if (board.isDisplayCheck == 'Y') {
		resultRaw += `<span>출력(${board.priority / 10})</span>`;
	}

	resultRaw += `			
            </div>
			<div class="result-body-column column4" style="width: 80px;">
                <button class="add-btn" data-idx="${board.boardIdx}">
					<span>등록</span>
				</button>			
            </div>
			<div class="result-body-column column5" style="width: 560px;">
                <span>${board.boardTitle}</span>
            </div>
			<div class="result-body-column column6" style="width: 100px;">
                <span>${formatDate(board.regDt)}</span>
            </div>
			<div class="result-body-column column7 fixed" style="width: 70px;">
	            <button class="info-btn" data-idx="${board.boardIdx}">
					<span class="blue">상세</span>
				</button>
	        </div>
	        <div class="result-body-column column8 fixed" style="width: 70px;">
				<button class="del-btn" data-board-idx="${board.boardIdx}">
					<span class="red">삭제</span>
				</button>
	        </div>
        </div>
	`;

	return resultRaw;
}

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

// 등록일 버튼 클릭 이벤트 (기간 설정 제외)
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

// 검색창에서 엔터키 입력
$('#search-input').keypress(function(event) {
	if (event.which === 13) {
		$("#search-btn").click();
	}
});

// 검색 버튼 클릭 이벤트
$('#search-btn').on('click', function() {

	// 검색필터 업데이트
	setSearchFilter();

	// 현재 페이지 1로
	searchFilter.currentPage = 1;

	// 검색 요청
	getBoardList(searchFilter);
});

// 초기화 버튼 클릭 이벤트
$('#reset-btn').on('click', function() {

	// 검색창 비우기
	$('#search-input').val('');

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

	// 현재 페이지 1
	searchFilter.currentPage = 1;

	setSearchFilter();

	// 초기화 후 검색 요청
	getBoardList(searchFilter)
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

	// 검색 갯수 조건 (10~100개)
	searchFilter.pageSize = $('input[name="count"]:checked').val();

	// 현재페이지 1로
	searchFilter.currentPage = 1;

	// 갯수 선택하면 바로 재검색
	getBoardList(searchFilter);
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
$('#result-container').on('change', '.board-all', function() {
	const isChecked = $(this).is(':checked');
	$('#result-body .board').prop('checked', isChecked);
});

// 개별 체크박스 이벤트 (이벤트 위임)
$('#result-container').on('change', '.board', function() {
	const total = $('#result-body .board').length; // 전체 체크박스 개수
	const checked = $('#result-body .board:checked').length; // 체크된 체크박스 개수
	// 모든 체크박스가 체크되었는지 확인
	$('#result-head .board-all').prop('checked', total === checked);
});

// 공지사항 생성 버튼 이벤트
$('#create-btn').on('click', function() {
	window.location.href = '/admin/boardCreate';
})

// 선택한 공지사항 삭제 버튼 클릭 이벤트
$('#all-del-btn').on('click', function() {
	// 선택된 체크박스를 가져옴
	const selectedBoard = $('#result-body .board:checked');

	if (selectedBoard.length === 0) {
		alert('공지사항을 선택하세요.');
		return;
	}

	const confirmed = confirm('정말로 선택한 공지사항들을 삭제 하시겠습니까?');

	if (!confirmed) {
		return;
	}

	// 삭제할 공지사항 인덱스 저장 객체
	let boardList = {
		boardIdx: []
	}

	// 선택된 공지사항 목록을 반복 처리
	selectedBoard.each(function() {
		const boardIdx = $(this).data('idx'); // 체크박스의 data-idx 속성에서 회원 idx 가져오기

		// 객체에 추가
		boardList.boardIdx.push(boardIdx);
	});


	console.log('삭제할 공지사항들: ', boardList);

	removeBoard(boardList);


});

// 개별 공지사항 삭제 버튼 클릭 이벤트
$('#result-body').on('click', '.del-btn', function() {
	const boardIdx = $(this).data('board-idx'); // 선택한 공지사항 인덱스
	let confirmed = confirm(`정말로 공지사항을 삭제 하시겠습니까?`);

	if (!confirmed) {
		return
	}

	// 삭제할 공지사항 인덱스 저장 객체
	let boardList = {
		boardIdx: [boardIdx]
	}

	// 서버에 요청
	removeBoard(boardList);

});

// 삭제 서버 요청 함수
function removeBoard(boardList) {
	// api 요청
	$.ajax({
		url: '/admin/api/board/removeBoard', // 서버의 삭제 API URL
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(boardList.boardIdx), // 서버에 전송할 데이터
		success: function(response) {
			// 성공 처리
			if (response.success) {
				alert(response.message);
				getTopBoard(); // 상위 노출 검색 요청
				getBoardList(searchFilter); // 검색 요청
			} else {
				alert(response.message);
			}
		},
		error: function(error) {
			// 오류 처리
			console.error('Error:', error);
			alert(`상태 변경 중 서버 오류가 발생했습니다.`);
		}
	});
}

// 자문 상세보기 클릭
$('#section2-main').on('click', '.info-btn', function() {
	// 선택한 자문 인덱스
	const boardIdx = $(this).data('idx');

	// URL
	const url = '/admin/boardDetail?boardIdx=' + boardIdx;

	// 페이지 이동
	window.location.href = url;

})


// 자문 상세보기 클릭
$('#result-body').on('click', '.info-btn', function() {
	// 선택한 자문 인덱스
	const boardIdx = $(this).data('idx');

	// URL
	const url = '/admin/boardDetail?boardIdx=' + boardIdx;

	// 페이지 이동
	window.location.href = url;

})

// 등록 버튼 클릭
$('#result-body').on('click', '.add-btn', function() {
	// 선택한 공지사항 인덱스
	const boardIdx = $(this).data('idx');
	console.log('메인화면 노출시킬 공지사항 인덱스: ', boardIdx)
	addTopBoard(boardIdx); // API 요청
})

// 메인 화면 노출 등록 API
function addTopBoard(boardIdx) {
	$.ajax({
		url: '/admin/api/board/addTopBoard',
		method: 'POST',
		contentType: 'application/json',
		data: JSON.stringify({ boardIdx: boardIdx }),
		success: function(response) {
			alert(response.message);
			getTopBoard();
			getBoardList(searchFilter);
		},
		error: function() {
			console.log('addTopBoard AJAX 요청 에러');
		}
	});
}

// 페이지 버튼 클릭 이벤트
$('#page-btn-container').on('click', '[data-page]', function() {
	searchFilter.currentPage = $(this).attr('data-page'); // 현재 페이지 설정 (선택한 페이지로)
	console.log('page-btn: ', searchFilter.currentPage);

	getBoardList(searchFilter);
});

// 노출 공지사항 스피너
function showLoadingTop() {
	$('#top-board-spinner').show();
}
function hideLoadingTop() {
	$('#top-board-spinner').hide();
}

// 공지사항 리스트 스피너
function showLoadingBoard() {
	$('#board-li-spinner').show();
}
function hideLoadingBoard() {
	$('#board-li-spinner').hide();
}
