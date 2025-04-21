// 로그인 실패 시 알림창, 화면에 폰트 로딩 후 알림 창 뜨도록 설정
document.fonts.ready.then(function () {
    if (typeof loginMsg !== 'undefined' && loginMsg) {
        alert(loginMsg); // 에러 메시지 출력
		$('#id-input').focus();
    }
	
});

