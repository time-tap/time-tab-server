
// 작업할 유저 인덱스
let jobSelectUserIdx = '';

// 작업할 유저 직무 인덱스
let selectUserJobIdx = '';

// 작업 타입(추가, 변경)
let jobActiveType = '';

// 선택한 직무 검색 필터 객체
let jobSearchFilterObject = {
	keyword: null,
	lcs: null,
	mcs: null,
	scs: null,
	page: 0,
	limit: 30
}

// 스크롤 업데이트 중복 요청 방지
let isLoadingJob = false;


// 직무 검색 창 실행
function showJobSearch(requestUserIdx, requestUserJobIdx, requestActiveType) {

	jobSelectUserIdx = requestUserIdx;
	selectUserJobIdx = requestUserJobIdx;
	jobActiveType = requestActiveType;
	console.log(jobActiveType)
	// 액티브 버튼 요청 타입에 따라 변경
	if (jobActiveType == 'change') {
		$('.modal-job-search-active-btn span').text('변경');
		$('.modal-job-search-active-btn').data('active-type', 'change')
	} else if (jobActiveType == 'add') {
		$('.modal-job-search-active-btn span').text('추가');
		$('.modal-job-search-active-btn').data('active-type', 'add')
	}
	
	// 직무 검색 필터
	getJobSearchFilter()
	
	// 직무 검색
	getJobSearchResult();
	
	// 직무 스크롤 업데이트 활성화
	scrollUpdateOn(); 
	
	// 창 열기
	$('#modal-job-search-wrap').addClass('open');
}

// 분류 필터 리스트 업데이트 API
function getJobSearchFilter() {

	console.log('jobSearch: ', jobSearchFilterObject);

	$.ajax({
		url: '/admin/api/ncs/getJobFilter',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(jobSearchFilterObject),
		success: function(response) {
			console.log('getJobSearchFilter response ', response);
			jobSearchFilterUpdate(response); // 검색 필터 업데이트
		},
		error: function(error) {
			console.log('error: ', error);
		}
	});
}

// 직무 필터 업데이트
function jobSearchFilterUpdate(data) {
	// 대분류 리스트 HTML
	let lcsHTML = `
		<button class="modal-job-search-detail-li modal-lcs" data-val="lcs-all">
			<span>선택 안함</span>
		</button>
	`;

	data.lcs.forEach(function(lcs) {
		lcsHTML += `
			<button class="modal-job-search-detail-li modal-lcs" data-val="${lcs}">
				<span>${lcs}</span>
			</button>
		`;
	});

	$('.modal-job-search-detail-li-container.modal-lcs').html(lcsHTML);

	// 중분류 리스트 HTML
	let mcsHTML = `
		<button class="modal-job-search-detail-li modal-mcs" data-val="mcs-all">
			<span>선택 안함</span>
		</button>
	`;

	if (data.isLcs) {
		data.mcs.forEach(function(mcs) {
			mcsHTML += `
				<button class="modal-job-search-detail-li modal-mcs" data-val="${mcs}">
					<span>${mcs}</span>
				</button>
			`;
		});
	}

	$('.modal-job-search-detail-li-container.modal-mcs').html(mcsHTML);

	// 소분류 리스트 HTML
	let scsHTML = `
		<button class="modal-job-search-detail-li modal-scs" data-val="scs-all">
			<span>선택 안함</span>
		</button>
	`;

	if (data.isMcs) {
		data.scs.forEach(function(scs) {
			scsHTML += `
				<button class="modal-job-search-detail-li modal-scs" data-val="${scs}">
					<span>${scs}</span>
				</button>
			`;
		});
	}

	$('.modal-job-search-detail-li-container.modal-scs').html(scsHTML);

}

// 분류 버튼 hover 이벤트
$('.modal-job-search-detail-btn').hover(
	function() {
		let id = $(this).attr("id"); // 현재 버튼의 ID 가져오기
		let targetContainer = ".modal-job-search-detail-li-container.modal-" + id.split("-")[1]; // 대응되는 컨테이너 ID 생성
		$(targetContainer).css("display", "flex"); // 해당 컨테이너 보이기
		// 분류 리스트 스크롤 상단으로 이동
		$('.modal-job-search-detail-li-container').scrollTop(0);
	},
	function() {
		let id = $(this).attr("id"); // 현재 버튼의 ID 가져오기
		let targetContainer = ".modal-job-search-detail-li-container.modal-" + id.split("-")[1];
		$(targetContainer).hide(); // 해당 컨테이너 숨기기
	}

);

// 분류 리스트 창 hover 이벤트
$('.modal-job-search-detail-li-container').hover(
	function() {
		$(this).css("display", "flex");
	},
	function() {
		$(this).hide();
	}
);

// 직무 검색 API
function getJobSearchResult() {
	console.log('직무 검색 진입 isLoadingJob: ', isLoadingJob);

	// 스크롤 업데이트 플래그 변수 확인 (중복 요청 방지)
	if (isLoadingJob) return;
	isLoadingJob = true;

	$.ajax({
		url: '/admin/api/ncs/getJobList',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(jobSearchFilterObject),
		success: function(response) {
			if (response.jobList.length === 0) {
				console.log('jobList.length === 0');
				scrollUpdateOff(); // 스크롤 업데이트 끄기
				
				return;
			}

			jobListUpdate(response); // 검색 결과 업데이트

			jobSearchFilterObject.page++;
		},
		error: function(error) {
			console.log('error: ', error);
		},
		complete: function() {
			isLoadingJob = false;
		}
	});
}

// 직무 검색 결과 업데이트
function jobListUpdate(data) {
	let jobListHTML = ``;

	data.jobList.forEach(function(job) {
		jobListHTML += `
			<div class="modal-job-search-result">
				<input type="radio" name="modal-job-search-result" class="modal-job-search-result-input" value="${job}" id="${job}">
				<label for="${job}" class="modal-job-search-result-label">
					${job}
				</label>
			</div>	
		`;
	});

	$('.modal-job-search-result-container').append(jobListHTML);
}

// 직무 검색 버튼 클릭
$('.modal-job-search-keyword-btn').on('click', function() {
	
	jobSearchFilterObject.keyword = $('.modal-job-search-keyword-input').val();
	
	// 스크롤 업데이트 켜기
	scrollUpdateOn();
		
	// 결과창 비우기
	$('.modal-job-search-result-container').html('');
	jobSearchFilterObject.page = 0; // 페이지 1로 초기화
	getJobSearchResult(); // 검색 요청 
});

// 직무 검색 창에서 엔터 입력시
$('.modal-job-search-keyword-input').keypress(function(event) {
	if (event.which === 13) {
		$(".modal-job-search-keyword-btn").click();
	}
});

// 분류 리스트 클릭
$('.modal-job-search-detail-li-container').on('click', '.modal-job-search-detail-li', function() {
	$('.modal-job-search-detail-li-container').hide(); // 리스트창 숨기기

	// 결과창 비우기
	$('.modal-job-search-result-container').html('');
	
	// 스크롤 업데이트 켜기
	scrollUpdateOn();

	jobSearchFilterObject.page = 0; // 페이지 1로 초기화

	let cls = $(this).attr('class').slice(-3); // 선택한 분류 구분 클래스값 (대,중,소)

	// 대중소 경우에 따라 처리
	// 대분류
	if (cls == 'lcs') {
		jobSearchFilterObject.lcs = $(this).data('val');
		if (jobSearchFilterObject.lcs == 'lcs-all') {
			// 대분류 창 업데이트
			$('.modal-job-search-detail-text.modal-lcs').text('대분류');
			$('.modal-job-search-detail-text.modal-lcs').removeClass('select');
			// 대분류 값 초기화
			jobSearchFilterObject.lcs = null;
		} else {
			// 대분류 창 업데이트
			$('.modal-job-search-detail-text.modal-lcs').text(jobSearchFilterObject.lcs);
			$('.modal-job-search-detail-text.modal-lcs').addClass('select');
		}

		// 중분류 창 초기화
		$('.modal-job-search-detail-text.modal-mcs').text('중분류');
		$('.modal-job-search-detail-text.modal-mcs').removeClass('select');

		// 소분류 창 초기화
		$('.modal-job-search-detail-text.modal-scs').text('소분류');
		$('.modal-job-search-detail-text.modal-scs').removeClass('select');

		// 중,소분류 값 초기화
		jobSearchFilterObject.mcs = null;
		jobSearchFilterObject.scs = null;

	}
	// 중분류
	else if (cls == 'mcs') {
		jobSearchFilterObject.mcs = $(this).data('val');
		if (jobSearchFilterObject.mcs == 'mcs-all') {
			// 중분류 창 업데이트
			$('.modal-job-search-detail-text.modal-mcs').text('중분류');
			$('.modal-job-search-detail-text.modal-mcs').removeClass('select');
			// 중분류 값 초기화
			jobSearchFilterObject.mcs = null;
		} else {
			$('.modal-job-search-detail-text.modal-mcs').text(jobSearchFilterObject.mcs);
			$('.modal-job-search-detail-text.modal-mcs').addClass('select');
		}

		// 소분류 창 초기화
		$('.modal-job-search-detail-text.modal-scs').text('소분류');
		$('.modal-job-search-detail-text.modal-scs').removeClass('select');

		// 소분류 값 초기화
		jobSearchFilterObject.scs = null;
	}
	// 소분류
	else if (cls == 'scs') {
		jobSearchFilterObject.scs = $(this).data('val');
		if (jobSearchFilterObject.scs == 'scs-all') {
			// 소분류 창 업데이트
			$('.modal-job-search-detail-text.modal-scs').text('소분류');
			$('.modal-job-search-detail-text.modal-scs').removeClass('select');
			// 소분류 값 초기화
			jobSearchFilterObject.scs = null;
		} else {
			$('.modal-job-search-detail-text.modal-scs').text(jobSearchFilterObject.scs);
			$('.modal-job-search-detail-text.modal-scs').addClass('select');
		}
	}

	// 직무 필터링 업데이트
	getJobSearchFilter();

	// 직무 검색
	getJobSearchResult();
});

// 직무 검색창 스크롤 업데이트 켜기
function scrollUpdateOn() {
	$('.modal-job-search-result-container').on('scroll', function() {
		if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight - 30) {
			getJobSearchResult();
		}
	})
}

// 직무 검색창 스크롤 업데이트 끄기
function scrollUpdateOff() {
	$('.modal-job-search-result-container').off('scroll');
}

// 변경 or 추가 버튼 클릭
$('.modal-job-search-active-btn').on('click', function() {
	// 선택한 직무 값 가져오기
	let selectJob = $('input[name="modal-job-search-result"]:checked').val();
		
	// 체크되지 않았을 경우 처리
    if (!selectJob) {
        alert('직무를 선택해주세요.');
        return;
    }
	
	// 변경 버튼인지 추가 버튼인지 확인
	let type = $('.modal-job-search-active-btn').data('active-type');
	
	// 변경 버튼
	if (type === 'change') {
		const isConfirmed = confirm(`직무를 "${selectJob}"(으)로 변경하시겠습니까?`);
		if (isConfirmed) {
			userJobUpdate(type, jobSelectUserIdx, selectUserJobIdx, selectJob);
		}
	} else if (type === 'add') {
		const isConfirmed = confirm(`"${selectJob}" 직무를 추가하시겠습니까?`);
		if (isConfirmed) {
			userJobUpdate(type, jobSelectUserIdx, selectUserJobIdx, selectJob);
		}
	}
	
});

// 유저 직무 업데이트 API
function userJobUpdate(jobActionTp, jobSelectUserIdx, selectUserJobIdx, selectJob) {
	
	// 직무 업데이트 API 요청
	$.ajax({
		url: '/admin/api/user/updateJob',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify({
			userIdx: jobSelectUserIdx,
			userJobIdx: selectUserJobIdx,
			selectJob: selectJob,
			jobActionTp: jobActionTp
		}),
		success: function(response) {
			$('.info-industry-job-search-container-wrap').click();
			alert(response.message);
			hideJobSearch(); // 직무 검색 창 숨기기
		},
		error: function(error) {
			console.log('error: ', error);
		}
	});
	
	
}

// 직무 검색 창 종료
function hideJobSearch() {
	resetJobSearch(); // 직무 검색창 초기화
	$('#modal-job-search-wrap').removeClass('open'); // 창 닫기
	
	console.log('직무 검색창 닫힘')
	if (typeof onJobSearchClosed === 'function') {
        onJobSearchClosed(); // 직접 함수 호출
    }
}

// 직무 검색 창 초기화
function resetJobSearch() {
	// 검색 필터 초기화
	jobSearchFilterObject = {
		keyword: null,
		lcs: null,
		mcs: null,
		scs: null,
		page: 0,
		limit: 30
	}
	
	// 검색창 비우기
	$('.modal-job-search-keyword-input').val('');
	
	// 필터창 초기화
	$('.modal-job-search-detail-text').removeClass('select');
	$('.modal-job-search-detail-text.modal-lcs').text('대분류');
	$('.modal-job-search-detail-text.modal-mcs').text('중분류');
	$('.modal-job-search-detail-text.modal-scs').text('소분류');	
	
	// 검색 결과 비우기
	$('.modal-job-search-result-container').html('');
}

// 취소 버튼 클릭 (창 닫기)
$('.modal-job-search-cancle-btn').on('click', function() {
	hideJobSearch()
})

// 검색 창 배경 클릭 시 닫기
$('#modal-job-search-wrap').on('click', function() {
	hideJobSearch()

});

// 자식 요소 클릭 시 이벤트 전파 방지
$('#modal-job-search-container').on('click', function(event) {
	event.stopPropagation();
});


