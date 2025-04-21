var userInfo = {}; // 로그인 정보 담을 곳

// 페이지 진입시 로그인 정보 가져오기
getUserStatus();

// 로그인 유저 가져오는 함수
function getUserStatus() {
	$.ajax({
		url: "/admin/api/login/getUserStatus",
		method: "GET",
		success: function(response) {
			if (response.loggedIn) {
				// 로그인 정보 userInfo에 저장
				userInfo = {
					isLoggedIn: response.loggedIn,
					userId: response.userId,
					userNm: response.userNm,
					userTel: response.userTel,
					statusCd: response.statusCd,
					authorities: response.authorities.map(auth => auth.authority),
				};

				console.log("로그인 성공 / userInfo:", userInfo);
				
				// 권한 기반 메뉴 생성
				createSidebarMenu(userInfo.authorities);
			} else {
				// 비로그인 상태 처리
				userInfo = {
					isLoggedIn: response.loggedIn,
					userId: null,
					userNm: null,
					userTel: null,
					authorities: [],
				};
				
				console.log("로그아웃 상태 - userInfo 초기화 완료", userInfo);
			}
		},
		error: function() {
			console.error("사용자 정보를 가져오는 중 오류 발생");
			// 오류 발생 시 userInfo 초기화
			userInfo = {
				isLoggedIn: false,
				userId: null,
				userNm: null,
				userTel: null,
				authorities: [],
			};
		}
	});
}

function createSidebarMenu(userAuthorities) {
	const isMaster = userAuthorities.includes("ROLE_ADMIN_MASTER");
	
	// 메뉴 HTML 구성
    let menuHtml = '';

    // 대시보드는 모든 사용자에게 노출
    menuHtml += `
        <div class="side-menu-dashboard">
            <button class="side-menu-dashboard-btn" id="menu-1" data-menu="1">
                <span class="side-menu-arrow-empty"></span>
                <span class="side-menu-nm">대시보드</span>
            </button>
        </div>
    `;

	// 관리자 계정
    const adminMenu = [];
    if (isMaster || userAuthorities.includes("ROLE_ADMIN_CREATE_ADMIN")) {
        adminMenu.push(`
            <button class="side-menu-sub-btn" id="menu-2-1" data-menu="2-1">
                <span class="side-menu-sub-nm">계정 생성</span>
            </button>
        `);
    }
    if (isMaster || userAuthorities.includes("ROLE_ADMIN_SEARCH_ADMIN")) {
        adminMenu.push(`
            <button class="side-menu-sub-btn" id="menu-2-2" data-menu="2-2">
                <span class="side-menu-sub-nm">목록 조회</span>
            </button>
        `);
    }
    if (adminMenu.length > 0) {
        menuHtml += `
            <div class="side-menu menu-2">
                <button class="side-menu-btn" data-menu="2">
                    <span class="side-menu-arrow"></span>
                    <span class="side-menu-nm">관리자 계정</span>
                </button>
            </div>
            <div id="menu-sub-2">${adminMenu.join('')}</div>
        `;
    }

    // 회원 관리
    const userMenu = [];
    if (isMaster || userAuthorities.includes("ROLE_ADMIN_BLOCK_USER")) {
        userMenu.push(`
            <button class="side-menu-sub-btn" id="menu-3-1" data-menu="3-1">
                <span class="side-menu-sub-nm">Block 관리</span>
            </button>
        `);
    }
    if (isMaster || userAuthorities.includes("ROLE_ADMIN_SEARCH_USER")) {
        userMenu.push(`
            <button class="side-menu-sub-btn" id="menu-3-2" data-menu="3-2">
                <span class="side-menu-sub-nm">회원 조회</span>
            </button>
        `);
    }
    if (userMenu.length > 0) {
        menuHtml += `
            <div class="side-menu menu-3">
                <button class="side-menu-btn" data-menu="3">
                    <span class="side-menu-arrow"></span>
                    <span class="side-menu-nm">회원 관리</span>
                </button>
            </div>
            <div id="menu-sub-3">${userMenu.join('')}</div>
        `;
    }

    // 자문 관리
    if (isMaster || userAuthorities.includes("ROLE_ADMIN_ADVISE")) {
        menuHtml += `
            <div class="side-menu menu-4">
                <button class="side-menu-btn" data-menu="4">
                    <span class="side-menu-arrow"></span>
                    <span class="side-menu-nm">자문 관리</span>
                </button>
            </div>
            <div id="menu-sub-4">
                <button class="side-menu-sub-btn" id="menu-4-1" data-menu="4-1">
                    <span class="side-menu-sub-nm">자문 관리</span>
                </button>
            </div>
        `;
    }

    // 게시판 관리
    if (isMaster || userAuthorities.includes("ROLE_ADMIN_BOARD")) {
        menuHtml += `
            <div class="side-menu menu-5">
                <button class="side-menu-btn" data-menu="5">
                    <span class="side-menu-arrow"></span>
                    <span class="side-menu-nm">게시판 관리</span>
                </button>
            </div>
            <div id="menu-sub-5">
                <button class="side-menu-sub-btn" id="menu-5-1" data-menu="5-1">
                    <span class="side-menu-sub-nm">공지사항</span>
                </button>
            </div>
        `;
    }

    // 메뉴 삽입
    $('#side-menu-box').html(menuHtml);
    // 메뉴 동작 이벤트 재바인딩
    bindMenuEvents();

    // 현재 페이지 강조 처리
    $(`#${currentMenu}`).addClass('select');
	
	restoreMenuState(); // 메뉴 생성 이후 호출

}

function bindMenuEvents() {
    $('.side-menu-btn').off('click').on('click', function () {
        const menuId = $(this).data("menu");
        subMenuToggle(menuId);
    });

    $('#menu-1').off('click').on('click', function () {
        window.location.href = '/admin/dashboard';
    });

    $('#menu-2-1').off('click').on('click', function () {
        window.location.href = '/admin/adminCreate';
    });

    $('#menu-2-2').off('click').on('click', function () {
        window.location.href = '/admin/adminSearch';
    });

    $('#menu-3-1').off('click').on('click', function () {
        window.location.href = '/admin/userBlock';
    });

    $('#menu-3-2').off('click').on('click', function () {
        window.location.href = '/admin/userSearch';
    });

    $('#menu-4-1').off('click').on('click', function () {
        window.location.href = '/admin/advise';
    });

    $('#menu-5-1').off('click').on('click', function () {
        window.location.href = '/admin/board';
    });
}

// 사이드 펼쳐져 있는 상태 유지
function restoreMenuState() {
	const menuState = JSON.parse(localStorage.getItem('menuState')) || {};

	Object.keys(menuState).forEach(menuId => {
		if (menuState[menuId]) {
			const subMenu = $(`#menu-sub-${menuId}`);
			const menuArrow = $(`[data-menu="${menuId}"] .side-menu-arrow`);
			menuArrow.addClass('open');
			subMenu.show().addClass('open');
		}
	});
}


// 메뉴 상태 저장 함수 (사이드 메뉴 펼쳐진 상태 저장)
function saveMenuState(menuId, isOpen) {
	// 클라이언트 로컬에 저장
	const menuState = JSON.parse(localStorage.getItem('menuState')) || {};
	menuState[menuId] = isOpen;
	localStorage.setItem('menuState', JSON.stringify(menuState));
}

// 서브 메뉴 토글 함수 (사이드 메뉴 펼치고 닫기)
function subMenuToggle(menuId) {
	// 메뉴 리스트 화살표
	const menuArrow = $(`[data-menu="${menuId}"] .side-menu-arrow`);
	// 서브 메뉴
	const subMenu = $(`#menu-sub-${menuId}`);

	subMenu.slideToggle(100, function() {
		subMenu.toggleClass('open');
		const isOpen = subMenu.hasClass('open');
		saveMenuState(menuId, isOpen); // 메뉴 상태 상태 저장
		// 화살표 열고 닫기
		if (isOpen) {
			menuArrow.addClass('open');
		} else {
			menuArrow.removeClass('open');
		}
	});
}

// 내 정보 아이콘 토글 버튼
$('#my-btn').on('click', function() {
	$('#my-detail').toggleClass('select');
});

// 내 정보 버튼 이외 부분 클릭시 내 정보 닫기
$(function() {
	$('#main-container').on('click', function() {
		$('#my-detail').removeClass('select');
	});
})
$('#side-container').on('click', function(e) {
	// 클릭한 요소가 #my-btn이 아닐 경우
	if (!$(e.target).closest('#my-btn').length) {
		$('#my-detail').removeClass('select');
	}
});

/* 내 정보 수정 모달 html은 mypage.jsp 확인 */
// 내 정보 수정 열고 내 정보 가져오기
$('#sidebar-mypage-btn').on('click', function() {
	if (userInfo.isLoggedIn) {
		// 내 정보 수정 열기
		$('#mypage-wrap').show();
		// 내 정보 모달에 내 정보 채우기
		$("#input-id").val(userInfo.userId);
		$("#input-nm").val(userInfo.userNm);
		$("#input-tel").val(userInfo.userTel);
	} else {
		alert('로그인 정보가 확인되지 않았습니다. 다시 로그인해주세요.');
	}
})

// 상단 로고 클릭시 홈으로
$('#side-title-btn').on('click', function() {
	window.location.href = '/';
});

// 로그아웃
$('#logout-btn').on('click', function() {
	// 메뉴 상태 저장한 로컬 스토리지 삭제
	localStorage.removeItem('menuState');
	window.location.href = '/logout';
});

