var playback_token = "GAlQ-qsj_____zRtanNueHV2czlqODNzcXNlc2dtc3d6eGthYnJhLmNvbVXG6RDPZy_WnlYtrkKBaP8=";
//var playback_token = "GAlQ-q99_____zRtanNueHV2czlqODNzcXNlc2dtc3d6eGxvY2FsaG9zdBAO6V1-QPyz3dqsqrU8XBc=";
var prevState = 2;
var nowplaying = "";
var rdio_ready = false;
var player;
var curstate = 2;
$(document).ready(function(){
	player = $('#player');
    player.bind('ready.rdio', function(event, user) {
		if(user != null){
			$('#login').show();
		}
		else{
			rdio_ready = true;
		}
    });
	player.bind('playStateChanged.rdio', function(e, state) {
		if(state == 2 && prevState != state){
			console.log('changing state '+state+' '+prevState);
			$('#nowplaying').empty();
			prevState = state;
			clearNowPlaying();
		}
		prevState = state;
	});
    player.rdio(playback_token);
});

function startrdio(){
	var player = $("#player");
    player.bind('ready.rdio', function(event, user) {
		if(user == null){
			$('#login').show();
		}
		else{
			$(this).rdio().play('a997982');
		}
    });
}

function rdiologin(){
	var dataString = "username="+$('#username').val()+"&password="+$('#password').val();
	$.ajax({
		type:'POST',
		url:"https://www.rdio.com/signin/",
		data: "username",
		success: function(data, status, xhr){ alert('sent');},
		error: function(xhr, status, thrown){ alert('error '+xhr.status+' '+thrown);}
	});
}