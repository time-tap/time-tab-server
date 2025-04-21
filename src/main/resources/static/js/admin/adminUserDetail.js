// 유저 인덱스 저장
const urlParams = new URLSearchParams(window.location.search);
const userIdx = urlParams.get('userIdx');

// 뒤로가기 버튼
$('.back-btn').click(function() {
	window.location.href = '/admin/adminSearch';
})

// 페이지 진입 시 유저 정보 요청
getAdminUserByUserIdx(userIdx);

// 관리자 계정 상세정보 요청 API
function getAdminUserByUserIdx(userIdx) {
	$.ajax({
		url: '/admin/api/admin/getAdminUserByUserIdx',
		method: 'POST',
		contentType: 'application/json',
		data: JSON.stringify({ userIdx: userIdx}),
		success: function(response) {
			console.log('test: ', response);
			adminUserDetailUpdate(response.user);
		},
		error: function() {
			console.log('getAdminUserByUserIdx AJAX 요청 실패');
		}
	})
}

// 화면 업데이트 함수
function adminUserDetailUpdate(user) {
	// 인풋창 업데이트
	$('#id-input').val(user.userId);
	$('#nm-input').val(user.userNm);
	$('#tel-input').val(user.userTel);

	// 관리자 등급 업데이트
	let isMaster = false;
	// 최고 관리자인지 확인
	for (let i = 0; i < user.authList.length; i++) {
		if (user.authList[i].authIdx == 'AU25030500000000') {
			isMaster = true;
			break;
		}
	}

	if (isMaster) {
		$('#super-admin').prop('checked', true);
	} else {
		$('#general-admin').prop('checked', true);
		$('#auth-detail-container').addClass('open');

		// 일반 관리자 권한 체크
		user.authList.forEach(function(auth) {
			$('input[name="auth-detail"]').each(function() {
				if ($(this).val() == auth.authIdx) {
					$(this).prop('checked', true);
				}
			});
		});
	}

}

// 비밀번호 변경 창 열렸는지 확인용
let isChangePw = false;

// 비밀번호 변경 버튼
$('#pw-input-box-change-btn').click(function() {
	$('.pw-input-box').toggleClass('open');
	$('.pw-input-box-change').toggleClass('open');

	// 플래그, 버튼 텍스트 업데이트
	if ($('.pw-input-box-change').hasClass('open')) {
		$('.pw-input-box-change-btn-text').text('취소');
		isChangePw = true;
	} else {
		isChangePw = false;
		$('.pw-input-box-change-btn-text').text('변경');
		$('#pw-input').val('');
		$('#pw-check-input').val('');
	}
})

// 관리자 등급 라디오 버튼
$('.auth-radio').on('change', function() {
	// 체크된 값 가져오기
	const checkedAuth = $(this).attr('id');

	// 일반 관리자이면 접근 권한 설정 창 열기
	if (checkedAuth == 'general-admin') {
		$('#auth-detail-container').addClass('open');
	} else {
		$('#auth-detail-container').removeClass('open');
	}
})

// 취소 버튼
$('.cancle-btn').click(function() {
	window.location.href = '/admin/adminSearch';
})

// 변경 버튼
$('.change-btn').click(function() {

	// 비밀번호 입력창 확인
	let inputPw = $('#pw-input').val();

	// 비밀번호 변경 창 열렸을 때 진행
	if (isChangePw) {

		if (inputPw == null || inputPw.trim() == '') {
			alert('비밀번호를 입력해주세요.');
			$('#pw-input').focus();
			return;
		}

		// 비밀번호 유효성 검사: 영문, 숫자, 특수문자 조합 가능 / 8자 이상 / 다른 문자 불가
		const pwPattern = /^[a-zA-Z0-9!@#$%^&*]{8,}$/;

		if (!pwPattern.test(inputPw)) {
			alert('비밀번호는 8자 이상이며, 영문/숫자/특수문자(!@#$%^&*)만 사용 가능합니다.');
			$('#pw-input').focus();
			return;
		}

		// 비밀번호 확인창 확인
		const inputPwCheck = $('#pw-check-input').val();

		if (inputPwCheck == null || inputPwCheck.trim() == '') {
			alert('비밀번호를 한번 더 입력해주세요.');
			$('#pw-check-input').focus();
			return;
		}

		if (inputPw !== inputPwCheck) {
			alert('비밀번호가 일치하지 않습니다.');
			$('#pw-input').focus();
			return;
		}
	}

	// 이름 입력창 확인
	const inputNm = $('#nm-input').val();

	if (inputNm == null || inputNm.trim() == '') {
		alert('이름을 입력해주세요.');
		$('#nm-input').focus();
		return;
	}

	// 전화번호 입력창 확인
	const inputTel = $('#tel-input').val();
	if (inputTel == null || inputTel.trim() == '') {
		alert('전화번호를 입력해주세요.');
		$('#tel-input').focus();
		return;
	}

	// 전화번호 유효성 검사: 숫자 11자리 체크
	const telPattern = /^\d{11}$/;
	if (!telPattern.test(inputTel)) {
		alert('전화번호는 숫자 11자리로 입력해주세요.(-제외)');
		$('#tel-input').focus();
		return;
	}

	// 권한 설정
	let auths = [];

	// 최고 관리자, 일반 관리자 인지 확인
	const checkedAuth = $('input[name="auth"]:checked').val();

	// 최고 관리자이면 마스터 권한 저장
	if (checkedAuth == 'AU25030500000000') {
		auths = ['AU25030500000000'];
	}
	// 일반 관리자이면 접근 권한 확인 후 저장 
	else {
		const checkedDetails = $('input[name="auth-detail"]:checked');

		// 체크된 항목이 0개면 리턴
		if (checkedDetails.length === 0) {
			alert('접근 권한을 하나 이상 선택하세요.');
			return;
		}

		// 체크된 항목이 있을 경우
		checkedDetails.each(function() {
			auths.push($(this).val());
		});
	}

	// 최종적으로 값 세팅
	let userPw = '';
	if (isChangePw) {
		userPw = inputPw;
	}
	const userNm = inputNm;
	const userTel = inputTel;

	updateAdminUser(userIdx, userPw, userNm, userTel, auths);

})

// 관리자 계정 변경 API
function updateAdminUser(userIdx, userPw, userNm, userTel, auths) {
	$.ajax({
		url: '/admin/api/admin/updateAdminUser',
		method: 'POST',
		contentType: 'application/json',
		data: JSON.stringify({
			userIdx: userIdx,
			userPw: userPw,
			userNm: userNm,
			userTel: userTel,
			auths: auths
		}),
		success: function(response) {
			alert(response.message);
			if (response.success) {
				if (isChangePw) {
					$('#pw-input-box-change-btn').click();
				}
			}
		},
		error: function() {
			console.log('createAdminUser AJAX 요청 실패');
		}
	})
}