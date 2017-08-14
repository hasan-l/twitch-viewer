var TwitchViewer = function(){
	//cached jQuery objects
	var $btnAll = $('.btn-all');
	var $buttons = $('.btn');
	var $notch = $('.notch');
	var $stream = $(".stream");
	var $statusIcon = $('.status i');
	var $streamLinkArea = $('.stream a');
	var $streamLogo = $(".stream a img");

	//adds initial btn style to btn lablled 'All'
	$btnAll.addClass('btn-bkgrnd-changed');
	$btnAll.find('.notch').addClass('changed');

	$buttons.click(function(){
		//removes background colour on active btn
		$buttons.removeClass('btn-bkgrnd-changed');
		//removes notch on active btn
		$notch.removeClass('changed');
		
		$(this).addClass('btn-bkgrnd-changed');
		$(this).find('.notch').addClass('changed');
	});

	var twitchStreamers = ["ESL_SC2", "OgamingSC2", "cretetion", "NALCS1", "storbeck", "habathcx", "RobotCaleb", "brunofin"];

	for(var i = 0; i < twitchStreamers.length; i++){
		
		var channelName = document.querySelectorAll('.channel-name');
		//add all the names of the streamers to the text content of the divs with class channel-name
		channelName[i].textContent = twitchStreamers[i];

		var twitchUrl = "https://wind-bow.gomix.me/twitch-api/streams/" + twitchStreamers[i] + "?callback=?";
		(function(i){
			//can't get streamers URL data from this call, so another is used below
			$.getJSON(twitchUrl, function(data){

				if(data.stream === null){
					//channel offline so show an 'x' icon
					//eq(i) finds element at the specificed index
					$statusIcon.eq(i).addClass("fa-times-circle");
				} else{
					//channel online
					$statusIcon.eq(i).addClass("fa-check");
					//get current status, i.e. what the channel is doing
					var statusDesc = data.stream.channel.status;
					if(statusDesc.length > 20){
						statusDesc = statusDesc.substring(0, 20);
					}
					//append channel status and current game that is being played as text right below channelName
					$streamLinkArea.eq(i).append("<div class='desc'><i>" + data.stream.channel.game + " - " + statusDesc + "...</i></div>");
				}
			});

			//couldn't get all info from single AJAX call (with this call, no data about if channel is online or not)
			$.getJSON("https://wind-bow.gomix.me/twitch-api/channels/" + twitchStreamers[i] + "?callback=?", function(apiResult){
				console.log(apiResult);
				//using the JSON data obtained from AJAX call, update href attribute of streamer
				$streamLinkArea.eq(i).attr("href", apiResult.url);
				//update src attribute for logo image
				$streamLogo.eq(i).attr("src", apiResult.logo);

				//if no logo or channel doesn't exist, show default cross image
				if(apiResult.logo === null || apiResult.status === 404){
					$streamLogo.eq(i).attr("src", "img/cross.jpg");
				}

				//specific case to show a streamer that doesn't exist
				if(apiResult.status === 404){
					channelName[i].textContent = "\"" + twitchStreamers[i]+ "\" doesn't exist";
				}
			});

		})(i);
	}

	//shows all streams
	$btnAll.click(function(){
		$stream.show();
	});

	$(".btn-online").click(function(){
		//reset by showing all and then remove streams that don't have a 'check'
		$stream.show();
		for(var j = 0; j < twitchStreamers.length; j++){
			if(!$statusIcon.eq(j).hasClass("fa-check")){
				$stream.eq(j).hide();
			}
		}
	});

	$(".btn-offline").click(function(){
		//reset by showing all and then remove streams that don't have a 'cross'
		$stream.show();
		for(var j = 0; j < twitchStreamers.length; j++){
			if(!$statusIcon.eq(j).hasClass("fa-times-circle")){
				$stream.eq(j).hide();
			}
		}
	});
}();