(function($) {
	$.fn.monthCalendar = function(options) {
		var defaults = {
			startYear: 2020,
			endYear: new Date().getFullYear(),
			onSelect: null
		};

		var settings = $.extend({}, defaults, options);

		return this.each(function() {
			var $input = $(this);

			// 달력 팝업이 없으면 생성
			if ($('#month-picker-popup').length === 0) {
				var $calendar = $('<div id="month-picker-popup" style="display:none; position:absolute; z-index:999;"></div>');
				var $yearSelect = $('<select id="popup-year"></select>');
				var $monthGrid = $('<div id="popup-month-grid"></div>');

				$calendar.append($yearSelect).append($monthGrid);
				$('body').append($calendar);

				// 월 버튼 클릭 처리
				$(document).on('click', '.month-btn', function() {

					$('.month-btn').removeClass('selected'); // 이전 선택 제거
					$(this).addClass('selected'); // 현재 선택 적용

					var year = $yearSelect.val();
					var month = $(this).data('month');
					var formatted = year + '-' + month;

					var $targetInput = $calendar.data('target');
					$targetInput.val(formatted);

					// 선택 콜백 호출
					var callback = $calendar.data('onSelect');
					if (typeof callback === 'function') {
						callback(formatted);
					}

					$calendar.hide();
				});

				// 외부 클릭 시 달력 닫기
				$(document).on('mousedown', function(e) {
					if (!$(e.target).closest('#month-picker-popup').length && !$(e.target).closest('input[data-month-calendar]').length) {
						$calendar.hide();
					}
				});

				// 전역 저장
				$.monthCalendarPopup = $calendar;
				$.monthCalendarYear = $yearSelect;
				$.monthCalendarGrid = $monthGrid;
			}

			var $popup = $.monthCalendarPopup;
			var $yearSelect = $.monthCalendarYear;
			var $monthGrid = $.monthCalendarGrid;

			// 해당 input에만 이벤트 바인딩
			$input.attr('data-month-calendar', 'true').on('click', function() {
				// 위치 계산
				var offset = $input.offset();
				var height = $input.outerHeight();

				// 년도 옵션 설정
				$yearSelect.empty();
				for (var y = settings.startYear; y <= settings.endYear; y++) {
					$yearSelect.append('<option value="' + y + '">' + y + '년</option>');
				}

				// 월 버튼 초기화 (최초 1회만 생성해도 됨)
				if ($monthGrid.children().length === 0) {
					for (var m = 1; m <= 12; m++) {
						var mm = ('0' + m).slice(-2);
						var $btn = $('<button type="button" class="month-btn" data-month="' + mm + '">' + m + '월</button>');
						$monthGrid.append($btn);
					}
				}

				// 오늘 날짜로 기본 설정
				var today = new Date();
				$yearSelect.val(today.getFullYear());

				// popup 표시
				$popup.css({
					top: offset.top + height + 4 + 'px',
					left: offset.left + 'px'
				}).show();

				// 선택 대상과 콜백 저장
				$popup.data('target', $input);
				$popup.data('onSelect', settings.onSelect);
			});
		});
	};
})(jQuery);
