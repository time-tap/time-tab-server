// 작업할 유저 인덱스
let industrySelectUserIdx = '';

// 작업할 유저 업종 인덱스
let selectUserIndustryIdx = '';

// 작업 타입(추가, 변경)
let industryActiveType = '';

// 선택한 업종 검색 필터 객체
let industrySearchFilterObject = {
	keyword: null,
	lcs: null,
	mcs: null,
	scs: null,
	page: 0,
	limit: 30
}

// 스크롤 업데이트 중복 요청 방지
let isLoadingIndustry = false;


// 업종 검색 창 실행
function showIndustrySearch(requestUserIdx, requestUserIndustryIdx, requestActiveType) {

	industrySelectUserIdx = requestUserIdx;
	selectUserIndustryIdx = requestUserIndustryIdx;
	industryActiveType = requestActiveType;
	console.log(industryActiveType)
	// 액티브 버튼 요청 타입에 따라 변경
	if (industryActiveType == 'change') {
		$('.modal-industry-search-active-btn span').text('변경');
		$('.modal-industry-search-active-btn').data('active-type', 'change')
	} else if (industryActiveType == 'add') {
		$('.modal-industry-search-active-btn span').text('추가');
		$('.modal-industry-search-active-btn').data('active-type', 'add')
	}
	
	// 업종 검색 필터
	getIndustrySearchFilter()
	
	// 업종 검색
	getIndustrySearchResult();
	
	// 업종 스크롤 업데이트 활성화
	industryScrollUpdateOn(); 
	
	// 창 열기
	$('#modal-industry-search-wrap').addClass('open');
}

// 분류 필터 리스트 업데이트 API
function getIndustrySearchFilter() {

	console.log('industrySearch: ', industrySearchFilterObject);

	$.ajax({
		url: '/admin/api/ncs/getIndustryFilter',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(industrySearchFilterObject),
		success: function(response) {
			industrySearchFilterUpdate(response); // 검색 필터 업데이트
		},
		error: function(error) {
			console.log('error: ', error);
		}
	});
}

// 업종 필터 업데이트
function industrySearchFilterUpdate(data) {
	// 대분류 리스트 HTML
	let lcsHTML = `
		<button class="modal-industry-search-detail-li modal-lcs" data-val="lcs-all">
			<span>선택 안함</span>
		</button>
	`;

	data.lcs.forEach(function(lcs) {
		lcsHTML += `
			<button class="modal-industry-search-detail-li modal-lcs" data-val="${lcs}">
				<span>${lcs}</span>
			</button>
		`;
	});

	$('.modal-industry-search-detail-li-container.modal-lcs').html(lcsHTML);

	// 중분류 리스트 HTML
	let mcsHTML = `
		<button class="modal-industry-search-detail-li modal-mcs" data-val="mcs-all">
			<span>선택 안함</span>
		</button>
	`;

	if (data.isLcs) {
		data.mcs.forEach(function(mcs) {
			mcsHTML += `
				<button class="modal-industry-search-detail-li modal-mcs" data-val="${mcs}">
					<span>${mcs}</span>
				</button>
			`;
		});
	}

	$('.modal-industry-search-detail-li-container.modal-mcs').html(mcsHTML);

	// 소분류 리스트 HTML
	let scsHTML = `
		<button class="modal-industry-search-detail-li modal-scs" data-val="scs-all">
			<span>선택 안함</span>
		</button>
	`;

	if (data.isMcs) {
		data.scs.forEach(function(scs) {
			scsHTML += `
				<button class="modal-industry-search-detail-li modal-scs" data-val="${scs}">
					<span>${scs}</span>
				</button>
			`;
		});
	}

	$('.modal-industry-search-detail-li-container.modal-scs').html(scsHTML);

}

// 분류 버튼 hover 이벤트
$('.modal-industry-search-detail-btn').hover(
	function() {
		let id = $(this).attr("id"); // 현재 버튼의 ID 가져오기
		let targetContainer = ".modal-industry-search-detail-li-container.modal-" + id.split("-")[1]; // 대응되는 컨테이너 ID 생성
		$(targetContainer).css("display", "flex"); // 해당 컨테이너 보이기
		// 분류 리스트 스크롤 상단으로 이동
		$('.modal-industry-search-detail-li-container').scrollTop(0);
	},
	function() {
		let id = $(this).attr("id"); // 현재 버튼의 ID 가져오기
		let targetContainer = ".modal-industry-search-detail-li-container.modal-" + id.split("-")[1];
		$(targetContainer).hide(); // 해당 컨테이너 숨기기
	}

);

// 분류 리스트 창 hover 이벤트
$('.modal-industry-search-detail-li-container').hover(
	function() {
		$(this).css("display", "flex");
	},
	function() {
		$(this).hide();
	}
);

// 업종 검색 API
function getIndustrySearchResult() {
	console.log('업종 검색 진입 isLoadingIndustry: ', isLoadingIndustry);

	// 스크롤 업데이트 플래그 변수 확인 (중복 요청 방지)
	if (isLoadingIndustry) return;
	isLoadingIndustry = true;

	$.ajax({
		url: '/admin/api/ncs/getIndustryList',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(industrySearchFilterObject),
		success: function(response) {
			if (response.industryList.length === 0) {
				console.log('industryList.length === 0');
				industryScrollUpdateOff(); // 스크롤 업데이트 끄기
				
				return;
			}

			industryListUpdate(response); // 검색 결과 업데이트

			industrySearchFilterObject.page++;
		},
		error: function(error) {
			console.log('error: ', error);
		},
		complete: function() {
			isLoadingIndustry = false;
		}
	});
}

// 업종 검색 결과 업데이트
function industryListUpdate(data) {
	let industryListHTML = ``;

	data.industryList.forEach(function(industry) {
		industryListHTML += `
			<div class="modal-industry-search-result">
				<input type="radio" name="modal-industry-search-result" class="modal-industry-search-result-input" value="${industry}" id="${industry}">
				<label for="${industry}" class="modal-industry-search-result-label">
					${industry}
				</label>
			</div>	
		`;
	});

	$('.modal-industry-search-result-container').append(industryListHTML);
}

// 업종 검색 버튼 클릭
$('.modal-industry-search-keyword-btn').on('click', function() {
	
	industrySearchFilterObject.keyword = $('.modal-industry-search-keyword-input').val();
	
	// 스크롤 업데이트 켜기
	industryScrollUpdateOn();
		
	// 결과창 비우기
	$('.modal-industry-search-result-container').html('');
	industrySearchFilterObject.page = 0; // 페이지 1로 초기화
	getIndustrySearchResult(); // 검색 요청 
});

// 업종 검색 창에서 엔터 입력시
$('.modal-industry-search-keyword-input').keypress(function(event) {
	if (event.which === 13) {
		$(".modal-industry-search-keyword-btn").click();
	}
});

// 분류 리스트 클릭
$('.modal-industry-search-detail-li-container').on('click', '.modal-industry-search-detail-li', function() {
	$('.modal-industry-search-detail-li-container').hide(); // 리스트창 숨기기

	// 결과창 비우기
	$('.modal-industry-search-result-container').html('');
	
	// 스크롤 업데이트 켜기
	industryScrollUpdateOn();

	industrySearchFilterObject.page = 0; // 페이지 1로 초기화

	let cls = $(this).attr('class').slice(-3); // 선택한 분류 구분 클래스값 (대,중,소)

	// 대중소 경우에 따라 처리
	// 대분류
	if (cls == 'lcs') {
		industrySearchFilterObject.lcs = $(this).data('val');
		if (industrySearchFilterObject.lcs == 'lcs-all') {
			// 대분류 창 업데이트
			$('.modal-industry-search-detail-text.modal-lcs').text('대분류');
			$('.modal-industry-search-detail-text.modal-lcs').removeClass('select');
			// 대분류 값 초기화
			industrySearchFilterObject.lcs = null;
		} else {
			// 대분류 창 업데이트
			$('.modal-industry-search-detail-text.modal-lcs').text(industrySearchFilterObject.lcs);
			$('.modal-industry-search-detail-text.modal-lcs').addClass('select');
		}

		// 중분류 창 초기화
		$('.modal-industry-search-detail-text.modal-mcs').text('중분류');
		$('.modal-industry-search-detail-text.modal-mcs').removeClass('select');

		// 소분류 창 초기화
		$('.modal-industry-search-detail-text.modal-scs').text('소분류');
		$('.modal-industry-search-detail-text.modal-scs').removeClass('select');

		// 중,소분류 값 초기화
		industrySearchFilterObject.mcs = null;
		industrySearchFilterObject.scs = null;

	}
	// 중분류
	else if (cls == 'mcs') {
		industrySearchFilterObject.mcs = $(this).data('val');
		if (industrySearchFilterObject.mcs == 'mcs-all') {
			// 중분류 창 업데이트
			$('.modal-industry-search-detail-text.modal-mcs').text('중분류');
			$('.modal-industry-search-detail-text.modal-mcs').removeClass('select');
			// 중분류 값 초기화
			industrySearchFilterObject.mcs = null;
		} else {
			$('.modal-industry-search-detail-text.modal-mcs').text(industrySearchFilterObject.mcs);
			$('.modal-industry-search-detail-text.modal-mcs').addClass('select');
		}

		// 소분류 창 초기화
		$('.modal-industry-search-detail-text.modal-scs').text('소분류');
		$('.modal-industry-search-detail-text.modal-scs').removeClass('select');

		// 소분류 값 초기화
		industrySearchFilterObject.scs = null;
	}
	// 소분류
	else if (cls == 'scs') {
		industrySearchFilterObject.scs = $(this).data('val');
		if (industrySearchFilterObject.scs == 'scs-all') {
			// 소분류 창 업데이트
			$('.modal-industry-search-detail-text.modal-scs').text('소분류');
			$('.modal-industry-search-detail-text.modal-scs').removeClass('select');
			// 소분류 값 초기화
			industrySearchFilterObject.scs = null;
		} else {
			$('.modal-industry-search-detail-text.modal-scs').text(industrySearchFilterObject.scs);
			$('.modal-industry-search-detail-text.modal-scs').addClass('select');
		}
	}

	// 업종 필터링 업데이트
	getIndustrySearchFilter();

	// 업종 검색
	getIndustrySearchResult();
});

// 업종 검색창 스크롤 업데이트 켜기
function industryScrollUpdateOn() {
	$('.modal-industry-search-result-container').on('scroll', function() {
		if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight - 30) {
			getIndustrySearchResult();
		}
	})
}

// 업종 검색창 스크롤 업데이트 끄기
function industryScrollUpdateOff() {
	$('.modal-industry-search-result-container').off('scroll');
}

// 변경 or 추가 버튼 클릭
$('.modal-industry-search-active-btn').on('click', function() {
	// 선택한 업종 값 가져오기
	let selectIndustry = $('input[name="modal-industry-search-result"]:checked').val();
		
	// 체크되지 않았을 경우 처리
    if (!selectIndustry) {
        alert('업종를 선택해주세요.');
        return;
    }
	
	// 변경 버튼인지 추가 버튼인지 확인
	let type = $('.modal-industry-search-active-btn').data('active-type');
	
	// 변경 버튼
	if (type === 'change') {
		const isConfirmed = confirm(`업종를 "${selectIndustry}"(으)로 변경하시겠습니까?`);
		if (isConfirmed) {
			userIndustryUpdate(type, industrySelectUserIdx, selectUserIndustryIdx, selectIndustry);
		}
	} else if (type === 'add') {
		const isConfirmed = confirm(`"${selectIndustry}" 업종를 추가하시겠습니까?`);
		if (isConfirmed) {
			userIndustryUpdate(type, industrySelectUserIdx, selectUserIndustryIdx, selectIndustry);
		}
	}
	
});

// 유저 업종 업데이트 API
function userIndustryUpdate(industryActionTp, industrySelectUserIdx, selectUserIndustryIdx, selectIndustry) {
	
	// 업종 업데이트 API 요청
	$.ajax({
		url: '/admin/api/user/updateIndustry',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify({
			userIdx: industrySelectUserIdx,
			userIndustryIdx: selectUserIndustryIdx,
			selectIndustry: selectIndustry,
			industryActionTp: industryActionTp
		}),
		success: function(response) {
			$('.info-industry-industry-search-container-wrap').click();
			alert(response.message);
			hideIndustrySearch(); // 업종 검색 창 숨기기
		},
		error: function(error) {
			console.log('error: ', error);
		}
	});
	
	
}

// 업종 검색 창 종료
function hideIndustrySearch() {
	resetIndustrySearch(); // 업종 검색창 초기화
	$('#modal-industry-search-wrap').removeClass('open'); // 창 닫기
	
	console.log('업종 검색창 닫힘')
	if (typeof onIndustrySearchClosed === 'function') {
        onIndustrySearchClosed(); // 직접 함수 호출
    }
}

// 업종 검색 창 초기화
function resetIndustrySearch() {
	// 검색 필터 초기화
	industrySearchFilterObject = {
		keyword: null,
		lcs: null,
		mcs: null,
		scs: null,
		page: 0,
		limit: 30
	}
	
	// 검색창 비우기
	$('.modal-industry-search-keyword-input').val('');
	
	// 필터창 초기화
	$('.modal-industry-search-detail-text').removeClass('select');
	$('.modal-industry-search-detail-text.modal-lcs').text('대분류');
	$('.modal-industry-search-detail-text.modal-mcs').text('중분류');
	$('.modal-industry-search-detail-text.modal-scs').text('소분류');	
	
	// 검색 결과 비우기
	$('.modal-industry-search-result-container').html('');
}

// 취소 버튼 클릭 (창 닫기)
$('.modal-industry-search-cancle-btn').on('click', function() {
	hideIndustrySearch()
})

// 검색 창 배경 클릭 시 닫기
$('#modal-industry-search-wrap').on('click', function() {
	hideIndustrySearch()

});

// 자식 요소 클릭 시 이벤트 전파 방지
$('#modal-industry-search-container').on('click', function(event) {
	event.stopPropagation();
});


