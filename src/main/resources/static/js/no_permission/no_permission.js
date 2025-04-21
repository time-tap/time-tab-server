$(window).on('load', function () {
	console.log('test')
	$('#logout-btn').on('click', function(){
		window.history.back();
	});
});