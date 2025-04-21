
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

// 계정 생성 버튼
$('.create-btn').on('click', function() {
	
	// 아이디 입력창 확인
	const inputId = $('#id-input').val();
	
	if (inputId == null || inputId.trim() == '') {
		alert('ID를 입력해주세요.');
		$('#id-input').focus();
		return;
	}
	
	// 아이디 유효성 검사: 4자 이상, 영문 + 숫자 + 특수문자 허용
	const idPattern = /^.{4,}$/;
	
	if (!idPattern.test(inputId)) {
	    alert('ID는 4자 이상 입력해주세요.');
	    $('#id-input').focus();
	    return;
	}
	
	// 비밀번호 입력창 확인
	const inputPw = $('#pw-input').val();
	
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
	if(checkedAuth == 'AU25030500000000') {
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
	const userId = inputId;
	const userPw = inputPw;
	const userNm = inputNm;
	const userTel = inputTel;
	
	createAdminUser(userId, userPw, userNm, userTel, auths);
	
})

// 관리자 계정 생성 API
function createAdminUser(userId, userPw, userNm, userTel, auths) {
	$.ajax({
		url: '/admin/api/admin/createAdminUser',
		method: 'POST',
		contentType: 'application/json',
		data: JSON.stringify({
			userId: userId,
			userPw: userPw,
			userNm: userNm,
			userTel: userTel,
			auths: auths
		}),
		success: function(response) {
			alert(response.message);
			if (response.success) {
				inputClear();	
			}
			
		},
		error: function() {
			console.log('createAdminUser AJAX 요청 실패');
		}
	})
}

// 관리자 생성 인풋창 초기화
function inputClear() {
	// 인풋창 비우기
	$('#id-input').val('');
	$('#pw-input').val('');
	$('#pw-check-input').val('');
	$('#nm-input').val('');
	$('#tel-input').val('');
	
	
	$('#super-admin').prop('checked', true); // 관리자 등급 최고 관리자 체크로 변경
	$('#auth-detail-container').removeClass("open") // 메뉴 접근 권한 창 닫기
	$('.auth-detail-checkbox').prop('checked', true); // 메뉴 접근 권한 모두 체크
	
}