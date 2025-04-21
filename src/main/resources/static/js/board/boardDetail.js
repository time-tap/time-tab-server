// 공지사항 상세 정보 호출
getBoardDetail(boardIdx);

// 뒤로가기 버튼
$('.back-btn').on('click', function() {
	window.location.href = '/admin/board';
})

// 공지사항 상세 정보 API
function getBoardDetail(boardIdx) {
	$.ajax({
		url: '/admin/api/board/getBoardDetail',
		method: 'POST',
		contentType: 'application/json',
		data: JSON.stringify({ boardIdx: boardIdx }),
		success: function(response) {
			console.log('getBoardDetail response ', response);
			boardUpdateUi(response.board); // 화면 업데이트
		},
		error: function() {
			console.log('ajax 요청 에러');
		}
	});
}

// 화면 업데이트
function boardUpdateUi(board) {
	
	// 등록일 업데이트
	$('.date').text(formatDateTime(board.regDt));
	
	// 제목 업데이트
	$('.title').val(board.boardTitle);
	
	console.log(board.isDisplayCheck)
	// 노출 상태 업데이트
	if (board.isDisplayCheck == 'Y') {
		$('.status-text').text('노출')
	} else {
		$('.status-text').text('비노출')
	}
	
	// 내용 업데이트
	$('#editorTxt').text(board.boardContent);
}

$('#save-btn').click(function() {
	const title = $('.title').val(); // 제목 저장
	
	// 스마트에디터 내용 동기화 (textarea와 싱크)
    oEditors.getById["editorTxt"].exec("UPDATE_CONTENTS_FIELD", []);

    // 에디터 내용 가져오기
    let content = oEditors.getById["editorTxt"].getIR();

    // 콘솔 출력
    console.log(content);
	
	updateBoard(title, content);
	
});

// 변경내용 저장 요청 API
function updateBoard(title, content) {
	$.ajax({
		url: '/admin/api/board/updateBoard',
		method: 'POST',
		contentType: 'application/json',
		data: JSON.stringify({
			boardIdx: boardIdx,
			title: title,
			content: content
		}),
		success: function(response) {
			alert(response.message);
		},
		error: function() {
			console.log('ajax요청 에러');
		}
	});
}

// 공지사항 삭제 버튼
$('#del-btn').click(function() {
	const isConfirmed = confirm('공지사항을 삭제하시겠습니까?');
	
	if(!isConfirmed) {
		return;
	}
	
	let boardIdxList = {
		boardIdx: [boardIdx]
	}
	
	removeBoard(boardIdxList);
})

// 삭제 API
function removeBoard(boardIdxList) {
	$.ajax({
		url: '/admin/api/board/removeBoard',
		method: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(boardIdxList),
		success: function (response) {
			if (response.success) {
				alert(response.message);
				window.location.href = '/admin/board';
			} else {
				alert(response.message);
			}
		},
		error: function() {
			console.log('ajax 요청 에러')
		}
		
	});
}

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