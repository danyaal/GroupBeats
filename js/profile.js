var channel = null;
function add_profile(first_name, last_name, icon_url, is_me) {
    var div = document.createElement("div");
    var icon = document.createElement("div");
    icon.style.width = icon.style.height = "50px";
    icon.style.backgroundImage = "url(\'" + icon_url + "\')";
    icon.style.backgroundSize = "cover";
    icon.style.margin = "0 auto";
    var me = is_me ? " (me)" : "";
    var first = document.createTextNode(" " + first_name + " " + last_name + me);

    div.appendChild(icon);                   
    div.appendChild(first);
    div.style.display = "inline-block";
    div.style.marginRight = "5%";

    var footerid = document.getElementById("footer");
    footerid.appendChild(div);
}
var myUserList = new IMO.UserList({
	"title":"",
	"css_url":"css/main.css"
});

var numUsers = 0;

$('#footer').append(myUserList.div);

function connect(){
	console.log("connecting");
	var client = {
		connect: function(){
			var queue = {"name": "imo.clients", "type": "event_queue"};
            channel.subscribe([queue], 0);
			console.log('subscribed');
		},
		event_queue: function(name, event){
			console.log('event queue called');
            if (name == "imo.clients") {
				console.log("found event queue clients");
				myUserList.add_user(event);
				numUsers = myUserList.userList.length;
				console.log(numUsers);
				if(numUsers == 1){
					console.log('subscribing to push '+myUserList.userList[0]);
					myUserList.set_data(event.setter, "host", event.setter);
					channel.subscribe([{"name":"push", "type":"event_stream"}], 0);
					channel.subscribe([{"name":"get", "type":"event_stream"}], 0);
					channel.subscribe([{"name":"vote","type":"event_stream"}], 0);
				}
				else{
					if(myUserList.get_data(myUserList.userList[0], "playlist") != null){
						playlist = myUserList.get_data(myUserList.userList[0], "playlist");
						$('#nowplaying').empty().append(playlist[0][1]);
						$('#queue').empty();
						for(var i = 1; i < playlist.length; i++){
							$('#queue').append("<li id='"+playlist[i][0]+"'><p>"+playlist[i][1]+"</p></li>");
						}
					}
					channel.subscribe([{"name":"pop", "type":"event_stream"}], 0);
					channel.subscribe([{"name":"give", "type":"event_stream"}], 0);
				}
			}
		},
		event_stream: function(name, event){
			if(name == "push"){
				console.log('detected push');
				newQueueItem(event.object.key, event.object.name, event.object.img);
			}
			else if(name == "get"){
				consol.log(playlist);
				channel.event_stream("give", {"object":{"playlist":playlist,"user":event.object.user}});
			}
			else if(name == "give" && event.object.user == channel.get_public_client_id()){
				playlist = event.object.playlist;
				console.log('giving '+playlist);
				$('#nowplaying').empty().append(playlist[0][1]);
				$('#queue').empty();
				for(var i = 1; i < playlist.length; i++){
					$('#queue').append("<li id='"+playlist[i][0]+"'><p>"+playlist[i][1]+"</p></li>");
				}
			}
			else if(name == "vote"){
				for(var i = 0; i<playlist.length; i++){
					if(event.object.songid == playlist[i][0]){
						playlist[i][2]++;
						break;
					}
				}
				$('#queue>#'+event.object.songid+'>div>p>.vote').empty().append("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+playlist[i][2]);
			}
			else{
				console.log('received pop');
				
				playlist = event.object;
				myUserList.set_data(myUserList.userList[0], "playlist", event.object);
				console.log(playlist);
				$('#queue').empty();
				for(var i = 1; i < playlist.length; i++){
					$('#queue').append("<li id="+playlist[i][0]+"><div style='display: inline-block;'><p style='float: left; margin-right: 5px;'>"+playlist[i][1]+"<span class='vote'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+playlist[i][2]+"</span></p><button style='float: right;' class='btn btn-small btn-success btn-vote' onclick='channel.event_stream(\"vote\", {\"object\":{\"songid\":\""+playlist[i][0]+"\"}});$(this).hide();'>Up</button></div></li>");
				}
			}
		},
	};
	return new IMO.Channel(client);
}

window.onload = function() {
    channel = connect();
	if(!playlist){
		channel.event_stream("get",{"object":{"user":channel.get_public_client_id()}});
	}
	console.log(playlist);
};