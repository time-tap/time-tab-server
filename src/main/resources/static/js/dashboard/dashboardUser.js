// 뒤로가기
$('.back-btn').click(function() {
	window.history.back();
});

// 회원 통계 요청
getUserStats();

// 회원 통계 API
function getUserStats() {
	$.ajax({
		url: '/admin/api/dashboard/overview',
		method: 'GET',
		success: function(response) {
			updateUserStats(response.userStats);
			showChart();
		},
		error: function(error) {
			console.log('Error: ', error);
		}
	});
}

// 회원 통계 업데이트
function updateUserStats(userStats) {
	
	// 전체 회원 카운트
	let userAllTotal = 0;
	// 전체 회원 오늘 가입 카운트
	let userAllToday = 0;
	
	userStats.forEach(function(stat) {
		$('#total-' + stat.userTp).text(formatNumber(stat.userCnt));
        $('#today-' + stat.userTp).text(formatNumber(stat.userTodayCnt));
		
		userAllTotal += stat.userCnt;
		userAllToday += stat.userTodayCnt;
	});
	
	$('#user-all-total').text(formatNumber(userAllTotal));
	$('#user-all-today').text(formatNumber(userAllToday));
}

function showChart() {
	google.charts.load('current', {'packages':['corechart']});
	google.charts.setOnLoadCallback(drawVisualization);
}

function drawVisualization() {
	// Some raw data (not necessarily accurate)
    var data = google.visualization.arrayToDataTable([
    	['Month', 'Bolivia', 'Ecuador', 'Madagascar', 'Papua New Guinea', 'Rwanda', 'Average'],
    	['2004/05',  165,      938,         522,             998,           450,      614.6],
    	['2005/06',  135,      1120,        599,             1268,          288,      682],
    	['2006/07',  157,      1167,        587,             807,           397,      623],
    	['2007/08',  139,      1110,        615,             968,           215,      609.4],
    	['2008/09',  136,      691,         629,             1026,          366,      569.6]
    ]);

    var options = {
    	//title : 'Monthly Coffee Production by Country',
    	//vAxis: {title: 'Cups'},
    	//hAxis: {title: 'Month'},
    	seriesType: 'bars',
    	series: {6: {type: 'line'}}
    };

    var chart = new google.visualization.ComboChart(document.getElementById('chart'));
    chart.draw(data, options);
}