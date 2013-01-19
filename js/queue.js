// JavaScript Document
var temp_list = [];
var playlist = [];

function newQueueItem(songkey, songtitle, img){
	var insert = [songkey, songtitle, 0, img];
	playlist.push(insert);
	console.log('adding to queue');
	$('#queue').append("<li id="+songkey+"><div style='display: inline-block;'><p style='float: left; margin-right: 5px;'>"+songtitle+" <span class='vote'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+0+"</span></p><button style='float: right;' class='btn btn-small btn-success btn-vote' onclick='channel.event_stream(\"vote\", {\"object\":{\"songid\":\""+songkey+"\"}});$(this).hide();'>Up</button></div></li>");
	if(playlist.length == 1 && curstate == 2){
		$('#queue').empty();
		$('#nowplaying').empty().append(playlist[0][1]);
		$('body').css({background:"url('"+img+"') no-repeat", 'background-position':'center'});
		player.rdio().play(playNext());
	}
	channel.event_stream("pop", {"object":playlist});
}

function playNext(){
	var newkey = playlist[0][0];
	return newkey;
}

var sortFunc = function( a, b) {
	return a[2] < b[2];
}

function clearNowPlaying(){
	$('#queue>li:first').remove();

	playlist.shift();

 	playlist.sort(sortFunc);

	$('#nowplaying').empty().append(playlist[0][1]);
	$('body').css({background:"url('"+playlist[0][3]+"') no-repeat", 'background-position':'center'});

	if(playlist == null){
		playlist = [];
	}
	channel.event_stream("pop", {"object":playlist});

	player.rdio().play(playNext());
	console.log('cleared now playing');
}