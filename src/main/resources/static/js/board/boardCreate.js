
// 뒤로가기 버튼
$('.back-btn').on('click', function() {
	window.location.href = '/admin/board';
})

// 네이버 스마트 에디터 2.0 적용
let oEditors = [];

smartEditor();

function smartEditor() {
	console.log("Naver SmartEditor");
	nhn.husky.EZCreator.createInIFrame({
		oAppRef: oEditors,
		elPlaceHolder: "editorTxt",
		sSkinURI: "/smarteditor/SmartEditor2Skin.html",
		fCreator: "createSEditor2",
		htParams: {
			bUseVerticalResizer: false  // 크기 조절 비활성화
		}
	});
}

// 취소 버튼
$('#cancle-btn').click(function() {
	window.location.href = '/admin/board';
})

// 생성 버튼
$('#create-btn').click(function() {
	const title = $('.title').val(); // 제목 저장

	// 스마트에디터 내용 동기화 (textarea와 싱크)
	oEditors.getById["editorTxt"].exec("UPDATE_CONTENTS_FIELD", []);

	// 에디터 내용 가져오기
	let content = oEditors.getById["editorTxt"].getIR();
	
	// 공지사항 생성 요청
	createBoard(title, content);

})

// 공지사항 생성 요청 API
function createBoard(title, content) {
	$.ajax({
		url: '/admin/api/board/createBoard',
		method: 'POST',
		contentType: 'application/json',
		data: JSON.stringify({
			title: title,
			content: content
		}),
		success: function(response) {
			if (response.success) {
				alert(response.message)
				window.location.href = '/admin/board'
			} else {
				alert(response.message)	
			}
			
		},
		error: function() {
			console.log('createBoard AJAX 요청 실패')
		}
	})
}