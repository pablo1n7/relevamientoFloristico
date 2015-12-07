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


var channel = require('cordova/channel'),
    utils = require('cordova/utils'),
    exec = require('cordova/exec');
    
/**
 * Provides access to a multi-featured audio player.
 */

module.exports = {

	/**
	 * Replaced defined object instance with object literal
	 */
	audioInfo: {
		currentTime: 0,
		duration: 0,
	},

	/**
	 * 
	 */
	startAudio: function(strRelativeFileURL, boolLoop) {
		//boolLoop is meant to be an optional parameter
		if(boolLoop == null || boolLoop == undefined) boolLoop = false;
		exec(null, null, "IntelXDKPlayer", "startAudio", [strRelativeFileURL, boolLoop]);
	},

	/**
	 * 
	 */
	toggleAudio: function() {
		exec(null, null, "IntelXDKPlayer", "toggleAudio", []);
	},

	/**
	 * 
	 */
	stopAudio: function() {
		exec(null, null, "IntelXDKPlayer", "stopAudio", []);
	},

	/**
	 * 
	 */
	setAudioVolume: function(volume) {
		exec(null, null, "IntelXDKPlayer", "setAudioVolume", [volume]);
	},

	/**
	 * 
	 */
	setAudioCurrentTime: function(time) {
		exec(null, null, "IntelXDKPlayer", "setAudioCurrentTime", [time]);
	},

	/**
	 * 
	 */
	getAudioCurrentTime: function(successCallback) {
		if (typeof successCallback == "function") {
			successCallback(this.audioInfo);
		}
	},

	/**
	 * 
	 */
	watchAudioCurrentTime: function(successCallback, frequency) {
		exec(null, null, "IntelXDKPlayer", "startUpdatingAudioTime", [frequency]);
		return setInterval(function() {
			intel.xdk.player.getAudioCurrentTime(successCallback);
		}, frequency);
	},

	/**
	 * 
	 */
	clearAudioCurrentTimeWatch: function(watchId) {
		exec(null, null, "IntelXDKPlayer", "stopUpdatingAudioTime", []);
		clearInterval(watchId);
	},

	/**
	 * 
	 */
	playPodcast: function(strPodcastURL) {
		exec(null, null, "IntelXDKPlayer", "playPodcast", [strPodcastURL]);
	},

	/**
	 * 
	 */
	playSound: function(strRelativeFileURL) {
		exec(null, null, "IntelXDKPlayer", "playSound", [strRelativeFileURL]);
	},

	/**
	 * 
	 */
	loadSound: function(strRelativeFileURL, count) {
		//count is meant to be an optional parameter
		if( typeof( count ) != "number" ) count = 1;
		exec(null, null, "IntelXDKPlayer", "loadSound", [strRelativeFileURL, count]);
	},

	/**
	 * 
	 */
	unloadSound: function(strRelativeFileURL) {
		exec(null, null, "IntelXDKPlayer", "unloadSound", [strRelativeFileURL]);
	},

	/**
	 * 
	 */
	unloadAllSounds: function() {
		exec(null, null, "IntelXDKPlayer", "unloadAllSounds", []);
	},
	
	/**
	 * 
	 */
	volume: function(iPercentage) {
		exec(null, null, "IntelXDKPlayer", "volume", [iPercentage]);
	},

	/**
	 * 
	 */
	startShoutcast: function(strStationURL, boolShowPlayer) {
		exec(null, null, "IntelXDKPlayer", "startShoutcast", [strStationURL, boolShowPlayer]);
	},

	//removed
	//public boolean isPlayingStation()
	//public void setPlayingStation(boolean playingStation)

	//removed
//	play: function() {
//		exec(null, null, "IntelXDKPlayer", "play", []);
//	},
//	pause: function() {
//		exec(null, null, "IntelXDKPlayer", "pause", []);
//	},
//	stop: function() {
//		exec(null, null, "IntelXDKPlayer", "stop", []);
//	},
//	rewind: function() {
//		exec(null, null, "IntelXDKPlayer", "rewind", []);
//	},
//	ffwd: function() {
//		exec(null, null, "IntelXDKPlayer", "ffwd", []);
//	},
//	setColors: function(strBackColor, strFillColor, strDoneColor, strPlayColor) {
//		alert('intel.xdk.player.setColors is deprecated and should no longer be used');
//	},
//	setPosition: function(portraitX, portraitY, landscapeX, landscapeY) {
//		alert('intel.xdk.player.setPosition is deprecated and should no longer be used');
//	},
//	startStation: function(strNetStationID, boolResumeMode, boolShowPlayer) {
//		alert('intel.xdk.player.startStation is deprecated and should no longer be used');
//	},
//	show: function() {
//		alert('intel.xdk.player.show is deprecated and should no longer be used');
//	},
//	hide: function() {
//		alert('intel.xdk.player.hide is deprecated and should no longer be used');
//	},



}
