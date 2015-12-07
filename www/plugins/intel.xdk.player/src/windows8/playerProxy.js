/*
Copyright 2015 Intel Corporation

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file 
except in compliance with the License. You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the 
License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
either express or implied. See the License for the specific language governing permissions 
and limitations under the License
*/


var commandProxy = require('cordova/windows8/commandProxy');

module.exports = {
    playingPodcast: false,
    playingAudio: false,
    mediaPlayer: null,
    soundName: "",
    audioVolume: 1,
    audioTime: 0,
    watchTimer: null,

    startAudio: function (successCallback, errorCallback, params) {
        var me = module.exports;

        if (me.playingPodcast) {
            var ev = document.createEvent('Events'); ev.initEvent('intel.xdk.player.audio.busy', true, true); document.dispatchEvent(ev);
            return;
        } else if (me.isPlaying()) {
            stopAudio();
        }

        //URL.createObjectURL
        me.soundName = params[0];

        if (me.mediaPlayer == null) {
            me.mediaPlayer = new Audio(me.soundName);
        }

        try {
            if (me.mediaPlayer != null) {
                me.mediaPlayer.addEventListener('ended', function (e) {
                    me.mediaPlayer.pause();
                    me.mediaPlayer = null;
                    me.playingAudio = false;
                    me.busy = false;
                }, false);

                //me.mediaPlayer.currentTime = 3;
                me.mediaPlayer.volume = me.audioVolume;
                me.mediaPlayer.play();
                me.playingAudio = true;
                var temp = me.mediaPlayer.seekable;

                var ev = document.createEvent('Events');
                ev.initEvent('intel.xdk.player.audio.start');
                document.dispatchEvent(ev);
            }
        } catch (e) {
            var ev = document.createEvent('Events');
            ev.initEvent('intel.xdk.player.audio.error',true,true);
            document.dispatchEvent(ev);
            me.busy = false;
        }
	},

	toggleAudio: function(successCallback, errorCallback, params) {
	    var me = module.exports;

	    if (me.mediaPlayer != null) {
	        if (me.isPlaying()) {
	            //me.audioTime = me.mediaPlayer.getCurrentPosition();
	            me.mediaPlayer.pause();
	        }
	        else {
	            //me.mediaPlayer.seekTo(me.audioTime);
	            me.mediaPlayer.play();
	        }

	        me.playingAudio = !me.playingAudio;
        }
	},

	stopAudio: function(successCallback, errorCallback, params) {
	    var me = module.exports;

	    if( me.mediaPlayer != null )
	    {
	        try {
	            me.mediaPlayer.pause();
	            me.mediaPlayer = null;
	            me.playingAudio = false;
	            var ev = document.createEvent('Events');
	            ev.initEvent('intel.xdk.player.audio.stop',true,true);
	            document.dispatchEvent(ev);
	        } catch (e) {
	            //e.printStackTrace();
	        }
	    }
	    me.playingAudio = false;
	},

	setAudioVolume: function(successCallback, errorCallback, params) {
	    var me = module.exports;

	    if( me.mediaPlayer != null )
	    {
	        me.audioVolume = params[0]; 
	        me.mediaPlayer.volume = me.audioVolume;
        }
	    
	    var ev = document.createEvent('Events');
	    ev.initEvent('intel.xdk.player.audio.volume.set', true, true);
	    e.success=(mediaPlayer == null) ? "false" : "true";
	    document.dispatchEvent(ev);
	},

	setAudioCurrentTime: function(successCallback, errorCallback, params) {
	    var me = module.exports;

	    var time = params[0];

	    var current = 0.0;
	    var length = 0.0;

	    if (me.mediaPlayer != null && me.isPlaying()) {
	        //me.audioTime = me.mediaPlayer.getCurrentPosition();
	        me.mediaPlayer.currentTime = time * 1000;
	        current = me.mediaPlayer.currentTime / 1000.0;
	        length = me.mediaPlayer.duration / 1000.0;
	    }

	    intel.xdk.player.audioInfo = {currentTime:current, duration:length};
	    var e = document.createEvent('Events');
	    e.initEvent('intel.xdk.player.audio.currenttime.set', true, true);
	    document.dispatchEvent(e);

	},

	startUpdatingAudioTime: function(successCallback, errorCallback, params) {
	    var me = module.exports;

	    var time = params[0];

	    if (me.watchTimer != null) {
	        clearInterval(me.watchTimer);
	    }

	    me.watchTimer = setInterval(function () {
	        var current = 0.0;
	        var length = 0.0;

	        try
	        {
	            if( me.mediaPlayer != null && me.isPlaying()) {           
	                current = me.mediaPlayer.currentTime / 1000.0;
	                length = me.mediaPlayer.duration / 1000.0;
	            }
	        }
	        catch(ex) { }
            
	        intel.xdk.player.audioInfo = {currentTime:current, duration:length};
        }, time);
	},

	stopUpdatingAudioTime: function(successCallback, errorCallback, params) {
	    if (me.watchTimer != null) {
	        clearInterval(me.watchTimer);
	        me.watchTimer = null;
	    }
	},

	playPodcast: function(successCallback, errorCallback, params) {
	    var e = document.createEvent('Events');
	    e.initEvent('intel.xdk.player.podcast.error', true, true);
	    e.success = false;
	    e.message = 'Podcast not implemented for Windows 8.';
	    document.dispatchEvent(e);
	},

	loadSound: function () {
	    var e = document.createEvent('Events');
	    e.initEvent('intel.xdk.player.podcast.error', true, true);
	    e.success = false;
	    e.message = 'Podcast not implemented for Windows 8.';
	    document.dispatchEvent(e);
	},
	
	unloadSound: function () {
	    var e = document.createEvent('Events');
	    e.initEvent('intel.xdk.player.podcast.error', true, true);
	    e.success = false;
	    e.message = 'Podcast not implemented for Windows 8.';
	    document.dispatchEvent(e);
	},

	unloadAllSounds: function () {
	    var e = document.createEvent('Events');
	    e.initEvent('intel.xdk.player.podcast.error', true, true);
	    e.success = false;
	    e.message = 'Podcast not implemented for Windows 8.';
	    document.dispatchEvent(e);
	},

	volume: function () {
	    var e = document.createEvent('Events');
	    e.initEvent('intel.xdk.player.podcast.error', true, true);
	    e.success = false;
	    e.message = 'Podcast not implemented for Windows 8.';
	    document.dispatchEvent(e);
	},

	startShoutcast: function () {
	    var e = document.createEvent('Events');
	    e.initEvent('intel.xdk.player.podcast.error', true, true);
	    e.success = false;
	    e.message = 'Podcast not implemented for Windows 8.';
	    document.dispatchEvent(e);
	},

	playSound: function (successCallback, errorCallback, params) {
	    var me = module.exports;

	    soundName = params[0];

	    var sound = new Audio(soundName);

	    try {
	        if (sound != null) {
	            sound.addEventListener('ended', function (e) {
	                sound.pause();
	                sound = null;
	            }, false);

	            //sound.currentTime = 3;
	            sound.volume = me.audioVolume;
	            sound.play();
	            var temp = sound.seekable;
	        }
	    } catch (e) {
	    }
	},

	isPlayingPodcast: function() {
	    return module.exports.playingPodcast;
    },

    isPlaying: function() {
        return module.exports.playingAudio;
    }
}

commandProxy.add('IntelXDKPlayer', module.exports);

