
// 패스워드 변경창 숨기기(기본값)
$('#input-pw-change-container').hide();

// 취소 버튼 클릭
$('#mypage-cancle-btn').on('click', function() {
	$('#mypage-wrap').hide();
	$('#pw-change-btn').removeClass('select');
	$('#input-tel').val(''); // 휴대폰 번호 창 비우기
	pwReset(); // 비밀번호 변경 부분 초기화
});

// 모달 하단 변경하기 버튼 (전화번호, 비밀번호 변경 기능)
$('#mypage-all-change-btn').on('click', function() {
	const newPw = $('#input-change-pw'); // 변경할 비밀번호
	const newPwCheck = $('#input-change-pw-check'); // 비밀번호 확인
	const newTel = $('#input-tel'); // 전화번호
	
	console.log('newPw: ', newPw.val());
	console.log('newPwCheck: ', newPwCheck.val());
	console.log('newTel: ', newTel.val());

	var isPw = false; // 비밀번호 입력 여부 확인
	var isTel = false; // 전화번호 변경사항 확인

	// api 요청 보낼 변경값 객체
	let updateInfo = {
		newPw: null,
		newTel: null
	};

	// 비밀번호 변경 창에 값이 있으면 isPw = true
	if (newPw.val() || newPwCheck.val()) {
		isPw = true;
	}

	// 전화번호 값이 변경되었으면 isTel = true
	if (!(userInfo.userTel === newTel.val())) {
		isTel = true;
	}

	// 변경할 값이 없을 때
	if (!isPw && !isTel) {
		alert('변경할 정보가 없습니다.');
		return; // 작업 종료
	}

	// pw 검사
	if (isPw) {
		// 비밀번호 : 8자리 이상, 대문자, 소문자, 숫자, 특수문자 포함
		const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
		
		// 유효성 확인
		if (!pwRegex.test(newPw.val())) {
			alert("비밀번호는 8자리 이상, 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.");
			newPw.focus(); // 해당 입력창 포커싱
			return; // 작업 종료
		}
		
		// 비밀번호 확인 값과 비교
		if (newPw.val() !== newPwCheck.val()) {
			alert('비밀번호가 일치하지 않습니다.');
			newPwCheck.focus(); // 해당 입력창 포커싱
			return; // 작업 종료
		}
		
		// 모두 통과하면 updateInfo 정보 입력
		updateInfo.newPw = newPw.val();
	}

	// tel 검사
	if (isTel) {
		// 전화번호 : 숫자 11자리
		const telRegex = /^\d{11}$/;
		
		// 유효성 확인
		if (!telRegex.test(newTel.val())) {
			alert('전화번호는 11자리 숫자여야 합니다. (\'-\'제외)');
			newTel.focus(); // 해당 입력창 포커싱
			return; // 작업 종료
		}
		// 유효성 통과하면 updateInfo 정보 입력
		updateInfo.newTel = newTel.val();
	}

	console.log('api 보낼 updateInfo: ', updateInfo);

	// pw, tel 검사 모두 통과하고 api 요청
	$.ajax({
		url: '/admin/api/login/updateInfo',
		method: 'POST',
		contentType: "application/json",
		data: JSON.stringify(updateInfo),
		success: function(response) {
			if (response.success) {
				alert(response.message);
				// userInfo 업데이트
				getUserStatus(); // 이 함수는 sidebar.js에서 정의
				// 비밀번호 변경창 닫기
				$('#pw-change-btn').removeClass('select');
				pwReset(); // 비밀번호 변경창 값 지우기
				$('#mypage-wrap').hide(); // 내 정보 수정 창 닫기

			} else {
				alert(response.message);
			}
		},
		error: function (xhr) {
			// 서버에서 유효성 검사 실패시 예외처리 (js에서 유효성 검사 실패시 작동 기능 그대로 구현하기 위해)
            const response = xhr.responseJSON;
            if (response && response.field) {
				// 어떤 유효성 검사가 틀렸는지 알림창
                alert(response.message);
				// 이상 있는 입력창 포커싱
                if (response.field === 'newPw') {
                    newPw.focus();
                } else if (response.field === 'newTel') {
                    newTel.focus();
                }
            } else {
                alert("서버 오류가 발생했습니다. 다시 시도해주세요.");
            }
        }
	});

});

// 배경 클릭 시 내 정보 수정 닫기
$('#mypage-wrap').on('click', function(e) {
	// 클릭한 요소가 #my-btn이 아닐 경우
	if (!$(e.target).closest('#mypage-container').length) {
		$('#mypage-wrap').hide();
		$('#pw-change-btn').removeClass('select');
		$('#input-tel').val(''); // 휴대폰 번호 창 비우기
		pwReset(); // 비밀번호 변경 부분 초기화
	}
});

// 비밀번호 변경 버튼 (변경창 열고 닫기)
$('#pw-change-btn').on('click', function() {
	$(this).toggleClass('select');

	if ($(this).hasClass('select')) {
		pwActive();
	} else {
		pwReset();
	}

});

// 비밀번호 변경 버튼 및 변경창 활성화
function pwActive() {
	$('#input-pw-container').hide();
	$('#input-pw-change-container').show();
}

// 비밀번호 변경 버튼 및 변경창 초기화
function pwReset() {
	$('#input-pw-change-container').hide();
	$('#input-pw-container').show();
	$('#input-change-pw').val('');
	$('#input-change-pw-check').val('');
}
