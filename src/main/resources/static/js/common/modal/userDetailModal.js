// 현재 출력중인 유저 인덱스
var showUserIdx = '';

// 유저 상세정보 창 출력 및 API 요청
function showUserDetail(userIdx) {
	showUserIdx = userIdx;
	$('#modal-user-detail-wrap').addClass('open');
	$('#modal-user-detail-wrap').scrollTop(0);

	// API 요청
	getUserInfo(showUserIdx);
}

// 유저 정보 요청 API
function getUserInfo(userIdx) {
	$.ajax({
		url: '/admin/api/user/getUserInfo',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify({ userIdx: userIdx }),
		success: function(response) {
			$('#modal-user-detail-main').html(createHtml(response)); // 상세 정보 창 업데이트
		},
		error: function(error) {
			console.log('error: ', error);
		}
	});
}


// html 생성
function createHtml(user) {

	// 유저 기본 정보 (인덱스, 아이디, 이름, 전화번호, 타입)
	const userInfo = user.userInfo;

	// 유저 주소 정보 (배열)
	const userAddress = user.userAddress;

	// 유저 업종 정보 (배열)
	const userIndustry = user.userIndustry;
	
	// 유저 직무 정보 (배열)
	const userJob = user.userJob;

	let html = `
		<div class="modal-user-detail-li">
			<div class="modal-user-detail-li-title">
				<span class="modal-user-detail-li-title-text">이메일</span>
			</div>
			<div class="modal-user-detail-li-input">
				<input type="text" class="modal-user-detail-email" value="${userInfo.userId}" readonly="reaonly">
			</div>
		</div>
		<div class="modal-user-detail-li">
			<div class="modal-user-detail-li-title">
				<span class="modal-user-detail-li-title-text">이름</span>
			</div>
			<div class="modal-user-detail-li-input">
				<input type="text" class="modal-user-detail-name" value="${userInfo.userNm}" readonly="reaonly">
			</div>
		</div>
		<div class="modal-user-detail-li">
			<div class="modal-user-detail-li-title">
				<span class="modal-user-detail-li-title-text">전화번호</span>
			</div>
			<div class="modal-user-detail-li-input">
				<input type="text" class="modal-user-detail-tel" value="${userInfo.userTel}">
				<button class="modal-user-detail-change-btn" id="modal-user-detail-change-btn-tel" data-idx="${userInfo.userIdx}">
					<span class="blue">변경</span>
				</button>
			</div>
		</div>
	`;

	// 타입별 주소 처리
	// 근로자
	if (userInfo.userTp == 'USBTP001') {

		html += `
			<div class="modal-user-detail-li">
				<div class="modal-user-detail-li-title">
					<span class="modal-user-detail-li-title-text">주소</span>
				</div>
		`;

		userAddress.forEach(function(address) {
			html += `
				<div class="modal-user-detail-li-input">
					<input type="text" class="modal-user-detail-address" value="${address.addressNm}">
					<button class="modal-user-detail-change-btn modal-user-detail-change-btn-address" data-idx="${address.addressIdx}">
						<span class="blue">변경</span>
					</button>
				</div>
			`;
		})

		html += `
			</div>
		`;
	}
	// 근로자 외
	else if (userInfo.userTp == 'USBTP002' || userInfo.userTp == 'USBTP003' || userInfo.userTp == 'USBTP004') {
		html += `
			<div class="modal-user-detail-li">
				<div class="modal-user-detail-li-title modal-add-btn">
					<span class="modal-user-detail-li-title-text">주소 (최대 5개)</span>
					<button class="modal-user-detail-add-btn modal-user-detail-add-btn-address">
						<span class="white">+ 추가</span>
					</button>					
				</div>
				<div class="modal-user-detail-li-input-wrap">
		`;

		// 주소 추가
		userAddress.forEach(function(address, index) {
			// 첫번째 주소는 변경 버튼
			if (index == 0) {
				html += `
					<div class="modal-user-detail-li-input">
						<input type="text" class="modal-user-detail-address" value="${address.addressNm}">
						<button class="modal-user-detail-change-btn modal-user-detail-change-btn-address" data-idx="${address.addressIdx}">
							<span class="blue">변경</span>
						</button>
					</div>
				`;
			} else { // 나머지는 삭제 버튼
				html += `
					<div class="modal-user-detail-li-input">
						<input type="text" class="modal-user-detail-address" value="${address.addressNm}">
						<button class="modal-user-detail-delete-btn modal-user-detail-delete-btn-address" data-idx="${address.addressIdx}">
							<span class="red">삭제</span>
						</button>
					</div>
				`;
			}

			html += `
				
			`;

		});

		html += `
				</div>
			</div>
		`;
	}

	// 업종 처리
	// 근로자
	if (userInfo.userTp == 'USBTP001') {
		html += `
			<div class="modal-user-detail-li">
				<div class="modal-user-detail-li-title">
					<span class="modal-user-detail-li-title-text">업종</span>
				</div>			
		`;
		// 업종 추가
		userIndustry.forEach(function(industry) {
			html += `
				<div class="modal-user-detail-li-input">
					<input type="text" class="modal-user-detail-industry" value="${industry.userIndustry}">
					<button class="modal-user-detail-change-btn modal-user-detail-change-btn-industry" data-idx="${industry.userIndustryIdx}">
						<span class="blue">변경</span>
					</button>
				</div>
			`;
		})

		html += `
			</div>
		`;
	}
	// 근로자 외
	else if (userInfo.userTp == 'USBTP002' || userInfo.userTp == 'USBTP003' || userInfo.userTp == 'USBTP004') {
		html += `
			<div class="modal-user-detail-li">
				<div class="modal-user-detail-li-title modal-add-btn">
					<span class="modal-user-detail-li-title-text">업종 (최대 5개)</span>
					<button class="modal-user-detail-add-btn modal-user-detail-add-btn-industry">
						<span class="white">+ 추가</span>
					</button>
				</div>
				<div class="modal-user-detail-li-input-wrap">
		`;

		// 업종 추가
		userIndustry.forEach(function(industry, index) {
			// 첫 번째 데이터는 변경 버튼
			if (index == 0) {
				html += `
					<div class="modal-user-detail-li-input">
						<input type="text" class="modal-user-detail-industry" value="${industry.userIndustry}">
						<button class="modal-user-detail-change-btn modal-user-detail-change-btn-industry" data-idx="${industry.userIndustryIdx}">
							<span class="blue">변경</span>
						</button>
					</div>
				`;
			} else { // 나머지는 삭제 버튼
				html += `
					<div class="modal-user-detail-li-input">
						<input type="text" class="modal-user-detail-industry" value="${industry.userIndustry}">
						<button class="modal-user-detail-delete-btn modal-user-detail-delete-btn-industry" data-idx="${industry.userIndustryIdx}">
							<span class="red">삭제</span>
						</button>
					</div>
				`;
			}
			
		})

		html += `
				</div>
			</div>
		`;
	}
	
	// 직무 추가
	// 근로자
	if (userInfo.userTp == 'USBTP001') {
		html += `
			<div class="modal-user-detail-li">
				<div class="modal-user-detail-li-title">
					<span class="modal-user-detail-li-title-text">직무</span>
				</div>			
		`;
		// 직무 추가
		userJob.forEach(function(job) {
			html += `
				<div class="modal-user-detail-li-input">
					<input type="text" class="modal-user-detail-job" value="${job.userJob}">
					<button class="modal-user-detail-change-btn modal-user-detail-change-btn-job" data-idx="${job.userJobIdx}">
						<span class="blue">변경</span>
					</button>
				</div>
			`;
		})

		html += `
			</div>
		`;
	}
	// 근로자 외
	else if (userInfo.userTp == 'USBTP002' || userInfo.userTp == 'USBTP003' || userInfo.userTp == 'USBTP004') {
		html += `
			<div class="modal-user-detail-li">
				<div class="modal-user-detail-li-title modal-add-btn">
					<span class="modal-user-detail-li-title-text">직무 (최대 5개)</span>
					<button class="modal-user-detail-add-btn modal-user-detail-add-btn-job">
						<span class="white">+ 추가</span>
					</button>
				</div>
				<div class="modal-user-detail-li-input-wrap">
		`;

		// 직무 추가
		userJob.forEach(function(job, index) {
			// 첫 번째 데이터는 변경 버튼
			if (index == 0) {
				html += `
					<div class="modal-user-detail-li-input">
						<input type="text" class="modal-user-detail-job" value="${job.userJob}">
						<button class="modal-user-detail-change-btn modal-user-detail-change-btn-job" data-idx="${job.userJobIdx}">
							<span class="blue">변경</span>
						</button>
					</div>
				`;
			} else { // 나머지는 삭제 버튼
				html += `
					<div class="modal-user-detail-li-input">
						<input type="text" class="modal-user-detail-job" value="${job.userJob}">
						<button class="modal-user-detail-delete-btn modal-user-detail-delete-btn-job" data-idx="${job.userJobIdx}">
							<span class="red">삭제</span>
						</button>
					</div>
				`;
			}
			
		})

		html += `
				</div>
			</div>
		`;
	}



	// 닫기 버튼
	html += `
		<button id="modal-user-detail-closed-btn">
			<span>닫기</span>
		</button>
	`;


	return html;
}

// 유저 전화번호 변경 버튼 
$('#modal-user-detail-main').on('click', '#modal-user-detail-change-btn-tel', function() {
	// 전화번호 변경 확인창
	const isConfirmed = confirm('전화번호를 변경하시겠습니까?');
	// 취소하면 return
	if (!isConfirmed) {
		return;
	}

	// 전화번호 유효성: 숫자 11자리
	const telRegex = /^\d{11}$/;

	// 변경할 전화번호
	const tel = $('.modal-user-detail-tel').val();

	// 변경할 유저 인덱스
	const userIdx = $(this).data('idx');

	// 유효성 확인
	if (!telRegex.test(tel)) {
		alert('전화번호는 11자리 숫자여야 합니다. (\'-\'제외)');
		$('#modal-user-detail-tel').focus(); // 해당 입력창 포커싱
		return; // 작업 종료
	}

	// 전화번호 변경 API 요청
	$.ajax({
		url: '/admin/api/user/updateTel',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify({
			tel: tel,
			userIdx: userIdx
		}),
		success: function(response) {
			alert(response.message);
		},
		error: function(error) {
			console.log('error: ', error);
		}
	})


})

// 유저 주소 추가 버튼
$('#modal-user-detail-container').on('click', '.modal-user-detail-add-btn-address', function() {
	// 현재 입력된 주소 개수 확인
	let addressCount = $('.modal-user-detail-address').length;

	if (addressCount >= 5) {
		alert("최대 5개의 주소만 등록할 수 있습니다.");
		return;
	}

	let addressActionTp = 'add'; // 추가 처리로 요청
	let addressIdx = null;
	postSearch(addressIdx, addressActionTp);
});

// 유저 주소 변경 버튼
$('#modal-user-detail-container').on('click', '.modal-user-detail-change-btn-address', function() {
	let addressIdx = $(this).data('idx'); // 변경할 주소 인덱스
	let addressActionTp = 'change'; // 변경 처리로 요청
	postSearch(addressIdx, addressActionTp);
});

// 유저 주소 삭제 버튼
$('#modal-user-detail-container').on('click', '.modal-user-detail-delete-btn-address', function() {
	const isConfirmed = confirm('주소를 삭제하시겠습니까?');

	if (isConfirmed) {
		let addressActionTp = 'delete' // 삭제 처리로 요청
		let addressIdx = $(this).data('idx');
		updateAddress(null, null, addressIdx, addressActionTp);
	}
});

// 다음 우편번호 검색
function postSearch(addressIdx, addressActionTp) {
	new daum.Postcode({
		oncomplete: function(data) {
			let address = data.address; // 주소
			let zonecode = data.zonecode; // 우편번호
			updateAddress(address, zonecode, addressIdx, addressActionTp); // 주소 업데이트 요청		
		}
	}).open();
}

// 유저 주소 업데이트 API 요청
function updateAddress(address, zonecode, addressIdx, addressActionTp) {
	$.ajax({
		url: '/admin/api/user/updateAddress',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify({
			address: address,
			zonecode: zonecode,
			addressIdx: addressIdx,
			addressActionTp: addressActionTp,
			userIdx: showUserIdx
		}),
		success: function(response) {
			alert(response.message);
			getUserInfo(showUserIdx);
		},
		error: function(error) {
			console.log('error: ', error);
		}
	});
}

// 업종 추가 버튼
$('#modal-user-detail-main').on('click', '.modal-user-detail-add-btn-industry', function() {
	let industryCount = $('.modal-user-detail-industry').length; // 요소 개수 확인
    if (industryCount >= 5) {
        alert("최대 5개의 업종만 등록할 수 있습니다."); // 경고 메시지 표시
        return; // 이벤트 중단
    }
	showIndustrySearch(showUserIdx, '', 'add');
})

// 업종 변경 버튼
$('#modal-user-detail-main').on('click', '.modal-user-detail-change-btn-industry', function() {
	let userIndustryIdx = $(this).data('idx');
	showIndustrySearch(showUserIdx , userIndustryIdx,'change');
})

// 유저 직무 삭제 버튼
$('#modal-user-detail-main').on('click', '.modal-user-detail-delete-btn-industry', function() {
	// 선택한 업종 인덱스
	let userIndustryIdx = $(this).data('idx');
	
	// 삭제할 업종 이름
	const deleteIndustryNm = $(this).closest('.modal-user-detail-li-input').find('.modal-user-detail-industry').val();
	
	const isConfirmed = confirm(`"${deleteIndustryNm}" 업종을 삭제하시겠습니까?`);
	
	if (isConfirmed) {
		userIndustryUpdate('delete', showUserIdx, userIndustryIdx, '');
		getUserInfo(showUserIdx);
	}
	
})

// 업종 검색창 이벤트 감지
function onIndustrySearchClosed() {
    console.log('업종 검색창 닫힘 감지됨');
    getUserInfo(showUserIdx);
}

// 직무 추가 버튼
$('#modal-user-detail-main').on('click', '.modal-user-detail-add-btn-job', function() {
	let jobCount = $('.modal-user-detail-job').length; // 요소 개수 확인
    if (jobCount >= 5) {
        alert("최대 5개의 직무만 등록할 수 있습니다."); // 경고 메시지 표시
        return; // 이벤트 중단
    }
	showJobSearch(showUserIdx, '', 'add');
})

// 직무 변경 버튼
$('#modal-user-detail-main').on('click', '.modal-user-detail-change-btn-job', function() {
	let userJobIdx = $(this).data('idx');
	showJobSearch(showUserIdx , userJobIdx,'change');
})

// 유저 직무 삭제 버튼
$('#modal-user-detail-main').on('click', '.modal-user-detail-delete-btn-job', function() {
	// 선택한 직무 인덱스
	let userJobIdx = $(this).data('idx');
	
	// 삭제할 직무 이름
	const deleteJobNm = $(this).closest('.modal-user-detail-li-input').find('.modal-user-detail-job').val();
	
	const isConfirmed = confirm(`"${deleteJobNm}" 직무를 삭제하시겠습니까?`);
	
	if (isConfirmed) {
		userJobUpdate('delete', showUserIdx, userJobIdx, '');
		getUserInfo(showUserIdx);
	}
	
})

// 직무 검색창 이벤트 감지
function onJobSearchClosed() {
    console.log('직무 검색창 닫힘 감지됨');
    getUserInfo(showUserIdx);
}


// 상세 정보 창 닫기 버튼
$('#modal-user-detail-main').on('click', '#modal-user-detail-closed-btn', function() {
	$('#modal-user-detail-wrap').removeClass('open'); // 창 닫기

	$('#modal-user-detail-main').html(''); // html 비우기
})

// 상세정보 창 배경 클릭 시 닫기
$('#modal-user-detail-wrap').on('click', function() {
	$('#modal-user-detail-wrap').removeClass('open'); // 창 닫기

	$('#modal-user-detail-main').html(''); // html 비우기
});

// 자식 요소 클릭 시 이벤트 전파 방지
$('#modal-user-detail-container').on('click', function(event) {
	event.stopPropagation();
});