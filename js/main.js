$(document).ready(function(){

	//adding btn style
	var btnAll = $('.btn-all');
	btnAll.addClass('btn-bkgrnd-changed');
	btnAll.find('.triangle').addClass('changed');

	$('.btn-all, .btn-online, .btn-offline').click(function(){
		$('.btn-all, .btn-online, .btn-offline').removeClass('btn-bkgrnd-changed');
		$('.triangle').removeClass('changed');
		
		$(this).addClass('btn-bkgrnd-changed');
		$(this).find('.triangle').addClass('changed');
	});

	var twitchStreamers = ["ESL_SC2", "OgamingSC2", "cretetion", "NALCS1", "storbeck", "habathcx", "RobotCaleb", "brunofin"];


	for(var i = 0; i < twitchStreamers.length; i++){
		
		var channelName = document.querySelectorAll('.channel-name');
		channelName[i].textContent = twitchStreamers[i];

		var twitchUrl = "https://wind-bow.gomix.me/twitch-api/streams/" + twitchStreamers[i] + "?callback=?";
		(function(i){
			$.getJSON(twitchUrl, function(data){
				console.log(data);
		
				if(data.stream === null){
					$('.status i').eq(i).addClass("fa-times-circle");
				} else{
					$('.status i').eq(i).addClass("fa-check");
					var statusDesc = data.stream.channel.status;
					if(statusDesc.length > 20){
						statusDesc = statusDesc.substring(0, 20);
					}
					$('.stream a').eq(i).append("<div class='desc'><i>" + data.stream.channel.game + " - " + statusDesc + "...</i></div>");
				}
			});

			$.getJSON("https://wind-bow.gomix.me/twitch-api/channels/" + twitchStreamers[i] + "?callback=?", function(apiResult){
				console.log(apiResult);
				$(".stream a").eq(i).attr("href", apiResult.url);

				if(apiResult.status === 404){
					channelName[i].textContent = "\"" + twitchStreamers[i]+ "\" doesn't exist";
					$(".stream a img").eq(i).attr("src", "img/cross.jpg");
				}
			});

		})(i);
	}

	btnAll.click(function(){
		$(".stream").show();
	});

	$(".btn-online").click(function(){
		$(".stream").show();
		for(var j = 0; j < twitchStreamers.length; j++){
			if(!$(".status i").eq(j).hasClass("fa-check")){
				$(".stream").eq(j).hide();
			}
		}
	});

	$(".btn-offline").click(function(){
		$(".stream").show();
		for(var j = 0; j < twitchStreamers.length; j++){
			if(!$(".status i").eq(j).hasClass("fa-times-circle")){
				$(".stream").eq(j).hide();
			}
		}
	});
});