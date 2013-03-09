var ExtendedAudio = function (path) {
    this.audio = this.getAudioSelector();
    this.src(path);
}

ExtendedAudio.prototype = {
    src: function (file) {
        //alert('prototype method called');
        var codec = this.getSupport();
        if (!codec) throw 'Your browser doesnt support audio';
        this.audio.src = file.replace(/\*/g, this.getSupport());
        this.audio.load();
        return this;
    },
    getSupport: function () {
        return !this.audio.canPlayType ? false :
            this.audio.canPlayType('audio/ogg;')  ? 'ogg' :
                this.audio.canPlayType('audio/mpeg;') ? 'mp3' : false;
    },
    getAudioSelector: function () {
        return $('audio')[0];
    },
    play: function () {
        this.audio.play();
    }
};

$(function () {
    var tracks = [];

	initAudio();
    $('.playlist a.item').click(function (e) {
        var activeClass = "active";

        tracks.push(this);

        selectTrack = function (DOMelement) {
            $(DOMelement).addClass(activeClass);
        }

        releasePlayedItems = function () {
            $('.playlist a.item').removeClass(activeClass);
        }

        // @todo название аттрибута вынести в настйроки
        var path = $(this).attr('data-source');

        // @todo make this function audio object proto method
        loadNewTrack(path);
        releasePlayedItems();
        selectTrack(this);
        Play();
        e.preventDefault();
    });
    $('#expander').click(function () {
        $('#player').toggleClass('expanded');
    });
});

function initAudio() {
	var supportsAudio = !!document.createElement('audio').canPlayType,
			audio,
			loadingIndicator,
			positionIndicator,
			timeleft,
			loaded = false,
			manualSeek = false;

	if (supportsAudio) {
		
		var player = '<p class="controls">\
		                              <span id="expander" class="closed" />\
									  <span id="playtoggle" class="pl" />\
									  <span id="gutter">\
									    <span id="loading" />\
									    <span id="handle" class="ui-slider-handle" />\
									  </span>\
									  <span id="timeleft" />\
									  <audio preload="metadata">\
									    <source src="http://78.47.220.210/paul.ogg" type="audio/ogg"></source>\
										<source src="http://78.47.220.210/paul.mp3" type="audio/mpeg"></source>\
										<source src="http://78.47.220.210/paul.wav" type="audio/x-wav"></source>\
									  </audio>\
									</p>';									
		
		$(player).insertBefore(".expansion");

		audio = $('.controls audio').get(0);
		loadingIndicator = $('.controls #loading');
		positionIndicator = $('.controls #handle');
		timeleft = $('.controls #timeleft');
		
		if ((audio.buffered != undefined) && (audio.buffered.length != 0)) {
			$(audio).bind('progress', function() {
				var loaded = parseInt(((audio.buffered.end(0) / audio.duration) * 100), 10);
				loadingIndicator.css({width: loaded + '%'});
			});
		}
		else {
			loadingIndicator.remove();
		}
		
		$(audio).bind('timeupdate', function() {
            //alert('timeupdate');
            // @todo check duration in right way. At least float
			if (parseInt(audio.duration) > 0) {
                var rem = parseInt(audio.duration - audio.currentTime, 10),
                        pos = (audio.currentTime / audio.duration) * 100,
                        mins = Math.floor(rem/60,10),
                        secs = rem - mins*60;

                timeleft.text('-' + mins + ':' + (secs < 10 ? '0' + secs : secs));
                if (!manualSeek) { positionIndicator.css({left: pos + '%'}); }
                if (!loaded) {
                    loaded = true;

                    $('.controls #gutter').slider({
                            value: 0,
                            step: 0.01,
                            orientation: "horizontal",
                            range: "min",
                            max: audio.duration,
                            animate: true,
                            slide: function(){
                                manualSeek = true;
                            },
                            stop:function(e,ui){
                                manualSeek = false;
                                audio.currentTime = ui.value;
                            }
                        });
                }
            }
			
		}).bind('play',function(){
			$("#playtoggle").addClass('playing');		
		}).bind('pause ended', function() {
			$("#playtoggle").removeClass('playing');		
		});		
		
		$("#playtoggle").click(function() {

			if (audio.paused) {	audio.play();	}
			else { audio.pause(); }
		});
	}
	
	
}

function loadNewTrack (path) {
    var audio = new ExtendedAudio(path);
    // @todo cach variable
    /*var audio = $('audio')
        , sources = audio.children('source')
        , extentions = [".mp3", ".ogg", ".vaw"];

    sources.each(function (index) {
        $(this).attr({"src": path + extentions[index]})
    });

    if (!audio[0].paused)
        audio[0].pause();

    audio.load();*/
    return;
}
function Play () {
    // @todo cach variable
    $('audio')[0].play();
    return;
}

