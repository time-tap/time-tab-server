// 작업할 유저 인덱스
let sendMailUserList;

// 작업 유형 (삭제, 중지, 복구)
let sendMailActiveType;

// 메일 전송 창 실행
function showSendMail(userList, activeType) {

	sendMailUserList = userList;
	
	sendMailActiveType = activeType;

	// 요청 타입에 따른 텍스트 출력
	switch (sendMailActiveType) {
	    case 'deleteUserOne': {
	        let userId = userList.userId[0];
	        $('.modal-send-mail-head-text').text(`탈퇴 사유 메일 전송 (${userId})`);
	        $('.modal-send-mail-active-btn span').text('메일 전송 및 탈퇴');
	        break;
	    }
	    case 'deleteUserGroup': {
	        let userCount = userList.userIdx.length;
	        $('.modal-send-mail-head-text').text(`탈퇴 사유 메일 전송 (선택한 사용자 ${userCount}명)`);
	        $('.modal-send-mail-active-btn span').text('메일 전송 및 탈퇴');
	        break;
	    }
	    case 'recoverUserOne': {
			let userId = userList.userId[0];
	        $('.modal-send-mail-head-text').text(`복구 사유 메일 전송 (${userId})`);
	        $('.modal-send-mail-active-btn span').text('메일 전송 및 복구');
	        break;
	    }
	    case 'recoverUserGroup': {
			let userCount = userList.userIdx.length;
	        $('.modal-send-mail-head-text').text(`복구 사유 메일 전송 (선택한 사용자 ${userCount}명)`);
	        $('.modal-send-mail-active-btn span').text('메일 전송 및 복구');
	        break;
	    }
	    case 'blockUserOne': {
			let userId = userList.userId[0];
	        $('.modal-send-mail-head-text').text(`중지 사유 메일 전송 (${userId})`);
	        $('.modal-send-mail-active-btn span').text('메일 전송 및 중지');
	        break;
	    }
	    case 'blockUserGroup': {
			let userCount = userList.userIdx.length;
	        $('.modal-send-mail-head-text').text(`중지 사유 메일 전송 (선택한 사용자 ${userCount}명)`);
	        $('.modal-send-mail-active-btn span').text('메일 전송 및 정지');
	        break;
	    }
	    default:
	        alert('요청 타입이 올바르지 않습니다.');
	        return;
	}
	
	$('.modal-send-mail-active-btn').attr('data-active-type', sendMailActiveType);

	// 출력
	$('#modal-send-mail-wrap').addClass('open');

}

// 액티브 버튼 클릭 이벤트(메일 전송 및 탈퇴, 메일 전송 및 정지)
$('.modal-send-mail-active-btn').on('click', function() {

	// 제목
	const titleText = $('.modal-send-mail-title-input').val();

	if (titleText == null || titleText.trim() == '') {
		alert('제목을 입력해주세요.')
		$('.modal-send-mail-title-input').focus();
		return;
	}

	// 내용
	const contentText = $('.modal-send-mail-content-input').val();

	if (contentText == null || contentText.trim() == '') {
		alert('내용을 입력해주세요.')
		$('.modal-send-mail-content-input').focus();
		return;
	}

	const emailContents = {
		title: titleText,
		content: contentText
	}

	if (sendMailActiveType === 'deleteUserOne' || sendMailActiveType === 'deleteUserGroup') {
		const isConfirmed = confirm(`탈퇴 사유 전송 및 탈퇴 처리 하시겠습니까?`);

		if (!isConfirmed) {
			return;
		}
		
		// 메일 전송 요청
		sendMail(sendMailUserList, emailContents);
		// 유저 탈퇴 요청
		sendMailupdateUserStatus(sendMailUserList, 'delete');
		
		return;
	} 
	
	else if (sendMailActiveType === 'recoverUserOne' || sendMailActiveType === 'recoverUserGroup') {
		const isConfirmed = confirm(`복구 사유 전송 및 복구 처리 하시겠습니까?`);

		if (!isConfirmed) {
			return;
		}
		
		// 메일 전송 요청
		sendMail(sendMailUserList, emailContents);
		// 유저 복구 요청
		sendMailupdateUserStatus(sendMailUserList, 'recover');
		
		return;
	}
	
	else if (sendMailActiveType === 'blockUserOne' || sendMailActiveType === 'blockUserGroup') {
		const isConfirmed = confirm(`중지 사유 전송 및 중지 처리 하시겠습니까?`);

		if (!isConfirmed) {
			return;
		}
		
		// 메일 전송 요청
		sendMail(sendMailUserList, emailContents);
		// 유저 중지 요청
		sendMailupdateUserStatus(sendMailUserList, 'block');
		
		return;
	}
	
	else {
		alert('요청 타입이 올바르지 않습니다.');
		return;
	}



})

// 메일 전송 요청
function sendMail(userList, emailContents) {
		
	const requestData = {
		userIdxList: userList.userIdx,
		userIdList: userList.userId,
		title: emailContents.title,
		content: emailContents.content
	}
	
	$.ajax({
		url: '/admin/api/email/sendMail',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(requestData),
		success: function(response) {
			console.log(response.success)
			console.log(response.message)
		},
		error: function() {
			console.log('sendMail AJAX 요청 실패')	
		}
	})
}

// 업데이트 요청 함수
function sendMailupdateUserStatus(userList, activeType) {
	const requestData = {
		userIdx: userList.userIdx,
		userId: userList.userId,
		statusCd: ''
	}
	
	// 요청 타입 입력
	if (activeType === 'delete') {
		requestData.statusCd = 'STTCD002'
	} else if (activeType === 'recover') {
		requestData.statusCd = 'STTCD001'
	} else if (activeType === 'block') {
		requestData.statusCd = 'STTCD003'
	} else {
		alert('sendMailupdateUserStatus 요청 타입 error')
	}
	
	// api 요청
	$.ajax({
		url: '/admin/api/user/updateUserStatus', // 서버의 삭제 API URL
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(requestData), // 서버에 전송할 데이터
		success: function(response) {
			if (response.success) {
				alert(response.message);
				hideSendMail();

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





// 메일 전송 창 종료
function hideSendMail() {
	$('.modal-send-mail-title-input').val(''); // 제목 입력창 비우기
	$('.modal-send-mail-content-input').val(''); // 내용 입력창 비우기
	$('#modal-send-mail-wrap').removeClass('open'); // 창 닫기

	// 이벤트 발생 (메일 전송 창 닫힘)
	$(document).trigger('sendMailClosed');

}



// 취소 버튼 클릭 (창 닫기)
$('.modal-send-mail-cancle-btn').on('click', function() {
	hideSendMail()
})

// 검색 창 배경 클릭 시 닫기
$('#modal-send-mail-wrap').on('click', function() {
	hideSendMail()

});

// 자식 요소 클릭 시 이벤트 전파 방지
$('#modal-send-mail-container').on('click', function(event) {
	event.stopPropagation();
});
