// 자문 정보 요청
getAdviseInfo(adviseIdx);

// 자문 채팅 내역 요청
getAdviseChat(adviseIdx);

// 뒤로가기 버튼
$('.back-btn').on('click', function() {
	window.location.href = '/admin/advise';
})

// 자문 정보 요청 API
function getAdviseInfo(adviseIdx) {
	$.ajax({
		url: '/admin/api/advise/getAdviseInfo',
		method: 'POST',
		contentType: 'application/json',
		data: JSON.stringify({ adviseIdx: adviseIdx }),
		success: function(response) {
			console.log('getAdviseInfo response: ', response);
			adviseInfoUpdate(response.adviseInfo); // 자문 정보 업데이트
		},
		error: function() {
			console.log('getAdviseInfo AJAX 요청 실패');
		}
	});
}

// 자문 상세 화면 업데이트
function adviseInfoUpdate(adviseInfo) {

	// 요청일 업데이트
	$('.advise-date').text(formatDateTime(adviseInfo.regDt));

	// 자문 제목 업데이트
	$('.advise-title').text(adviseInfo.adviseTitle);

	// 진행 상황 업데이트
	$('.advise-status').text(adviseStatusNm(adviseInfo.adviseStatusCd));

	// 전문가 정보 업데이트
	$('.info-detail.id.adviser').text(adviseInfo.adviserId);
	$('.info-detail.nm.adviser').text(adviseInfo.adviserNm);
	$('.info-detail.tp.adviser').text(resultTp(adviseInfo.adviserTp));
	$('.user-detail-btn.adviser').attr('data-idx', adviseInfo.adviserIdx);

	// 요청자 정보 업데이트
	$('.info-detail.id.user').text(adviseInfo.userId);
	$('.info-detail.nm.user').text(adviseInfo.userNm);
	$('.info-detail.tp.user').text(resultTp(adviseInfo.userTp));
	$('.user-detail-btn.user').attr('data-idx', adviseInfo.userIdx);
	
}

$('.user-detail-btn').click(function() {
	// 선택한 유저 인덱스
	const userIdx = $(this).data('idx');
	
	// 상세정보창 출력 
	showUserDetail(userIdx);
})

// 자문 채팅 내역 요청 API
function getAdviseChat(adviseIdx) {
	$.ajax({
		url: '/admin/api/advise/getAdviseChat',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify({ adviseIdx: adviseIdx }),
		success: function(response) {
			console.log('getAdviseChat response: ', response);
			adviseChatUpdate(response);			
		},
		error: function() {
			console.error('getAdviseChat AJAX 요청 실패');
		}
	});
}

// 자문 채팅 내역 업데이트
function adviseChatUpdate(data) {
	// 자문가, 요청자 인덱스 정보
	const adviseTp = data.adviseTp;
	
	let chatHTML = ``;
	
	if (data.adviseChat && data.adviseChat.length > 0) {
		// 검색 결과가 있을 경우
		data.adviseChat.forEach(function(chat) {
			chatHTML += adviseChatRow(chat, adviseTp);
		})
	} else {
		// 검색 결과가 없을 경우
		chatHTML += `
            <div class="no-results">
                <p>채팅 내역이 없습니다.</p>
            </div>
        `;
	}
	
	
	
	$('.info-chat-main').html(chatHTML);
}

// 자문 채팅 HTML 생성 함수
function adviseChatRow(chat, adviseTp) {
	let chatHTML = `
		<div class="info-chat-li">
			<div class="info-chat-li-head">
	`;
	
	if (chat.adChatUserIdx == adviseTp.adviserUserIdx) {
		chatHTML += `<div class="info-chat-tp adviser">자문가</div>`;
	} else {
		chatHTML += `<div class="info-chat-tp user">요청자</div>`;
	}
	
	chatHTML += `
				<div class="info-chat-date">${formatDateTime(chat.regDt)}</div>
			</div>
			<div class="info-chat-li-main">
				<div class="info-chat">${escapeHtml(chat.adChat)}</div>
			</div>
		</div>
	`;
	
	return chatHTML;
}

// 상태 클릭
$('.advise-status-btn').on('click', function() {
	$('.advise-status-li-container').toggleClass('open');
});

// 상태 선택 창 닫기
$('.advise-status-li').on('click', function() {
	$('.advise-status-li-container').removeClass('open');
});

// 상태 선택 창 밖에 클릭 시 닫기
$('#wrap').on('click', function(event) {
	if (!$(event.target).closest('.advise-status-btn, .advise-status-li-container').length) {
		$('.advise-status-li-container').removeClass('open');
	}
});

// 상태 선택 클릭
$('.advise-status-li').on('click', function() {
	// 선택한 상태
	const statusCd = $(this).data('code');
	// 선택한 상태명
	const statusNm = adviseStatusNm(statusCd);

	let confirmed = confirm(`자문을 ${statusNm}(으)로 변경 하시겠습니까?`);

	if (!confirmed) {
		return
	}

	// 삭제할 자문 인덱스 저장 객체
	let adviseIdxList = {
		adviseIdx: [adviseIdx],
		statusCd: statusCd
	}

	// 서버에 요청
	updateAdvise(adviseIdxList);

});

// 상태 변경 요청 API
function updateAdvise(adviseIdxList) {
	// api 요청
	$.ajax({
		url: '/admin/api/advise/updateAdvise', // 서버의 삭제 API URL
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(adviseIdxList), // 서버에 전송할 데이터
		success: function(response) {
			// 성공 처리
			if (response.success) {
				alert(response.message);
				getAdviseInfo(adviseIdx); // 자문 정보 조회
			} else {
				alert(response.message);
			}
		},
		error: function() {
			console.log('updateAdvise AJAX 요청 실패')
		}
	});
}

// 자문 삭제 버튼
$('#advise-del-btn').on('click', function() {

	// 자문 삭제 확인
	const isConfirmed = confirm(`자문을 삭제하면 복구할 수 없습니다.\n정말 삭제하시겠습니까?`);

	if (!isConfirmed) {
		return;
	}

	// 삭제할 자문 인덱스 저장 객체
	let adviseIdxList = {
		adviseIdx: [adviseIdx]
	}

	// 서버에 요청
	removeAdvise(adviseIdxList);
});

// 자문 삭제 서버 요청 API
function removeAdvise(adviseIdxList) {
	// api 요청
	$.ajax({
		url: '/admin/api/advise/removeAdvise',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(adviseIdxList),
		success: function(response) {
			// 성공 처리
			if (response.success) {
				alert(`자문이 삭제되었습니다.\n자문 관리 페이지로 이동합니다.`);
				window.location.href = '/admin/advise';
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