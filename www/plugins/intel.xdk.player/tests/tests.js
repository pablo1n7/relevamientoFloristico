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

/*global exports, describe, it, xit, expect, intel, console, document, cordova, navigator */

exports.defineAutoTests = function () {
    'use strict';
    
    describe('api tests', function () {
        it('should be defined', function () {
            expect(intel.xdk.player).toBeDefined();
        });
        
        it('should have a startAudio method', function () {
            expect(intel.xdk.player.startAudio).toBeDefined();
            expect(typeof intel.xdk.player.startAudio).toEqual('function');
        });
        
        it('should have a toggleAudio method', function () {
            expect(intel.xdk.player.toggleAudio).toBeDefined();
            expect(typeof intel.xdk.player.toggleAudio).toEqual('function');
        });
        
        it('should have a stopAudio method', function () {
            expect(intel.xdk.player.stopAudio).toBeDefined();
            expect(typeof intel.xdk.player.stopAudio).toEqual('function');
        });
        
        it('should have a setAudioVolume method', function () {
            expect(intel.xdk.player.setAudioVolume).toBeDefined();
            expect(typeof intel.xdk.player.setAudioVolume).toEqual('function');
        });
        
        it('should have a setAudioCurrentTime method', function () {
            expect(intel.xdk.player.setAudioCurrentTime).toBeDefined();
            expect(typeof intel.xdk.player.setAudioCurrentTime).toEqual('function');
        });
        
        it('should have a watchAudioCurrentTime method', function () {
            expect(intel.xdk.player.watchAudioCurrentTime).toBeDefined();
            expect(typeof intel.xdk.player.watchAudioCurrentTime).toEqual('function');
        });
        
        /** this spec if failing */
        xit('should have a startUpdatingAudioTime method', function () {
            expect(intel.xdk.player.startUpdatingAudioTime).toBeDefined();
            expect(typeof intel.xdk.player.startUpdatingAudioTime).toEqual('function');
        });
        
        /** this spec if failing */
        xit('should have a stopUpdatingAudioTime method', function () {
            expect(intel.xdk.player.stopUpdatingAudioTime).toBeDefined();
            expect(typeof intel.xdk.player.stopUpdatingAudioTime).toEqual('function');
        });
        
        it('should have a playSound method', function () {
            expect(intel.xdk.player.playSound).toBeDefined();
            expect(typeof intel.xdk.player.playSound).toEqual('function');
        });
        
        it('should have a loadSound method', function () {
            expect(intel.xdk.player.loadSound).toBeDefined();
            expect(typeof intel.xdk.player.loadSound).toEqual('function');
        });
        
        it('should have a unloadSound method', function () {
            expect(intel.xdk.player.unloadSound).toBeDefined();
            expect(typeof intel.xdk.player.unloadSound).toEqual('function');
        });
        
        it('should have a unloadAllSounds method', function () {
            expect(intel.xdk.player.unloadAllSounds).toBeDefined();
            expect(typeof intel.xdk.player.unloadAllSounds).toEqual('function');
        });
        
        it('should have a volume method', function () {
            expect(intel.xdk.player.volume).toBeDefined();
            expect(typeof intel.xdk.player.volume).toEqual('function');
        });
        
        it('should have a playPodcast method', function () {
            expect(intel.xdk.player.playPodcast).toBeDefined();
            expect(typeof intel.xdk.player.playPodcast).toEqual('function');
        });
        
        it('should have a startShoutcast method', function () {
            expect(intel.xdk.player.startShoutcast).toBeDefined();
            expect(typeof intel.xdk.player.startShoutcast).toEqual('function');
        });
    });
};

exports.defineManualTests = function (contentEl, createActionButton) {
    'use strict';
    
    /** object to hold properties and configs */
    var PlayerTestSuite = {};
    
    PlayerTestSuite.soundExtension = null;
    
    PlayerTestSuite.volume = 1;
    
    function logMessage(message, color) {
        var log = document.getElementById('info'),
            logLine = document.createElement('div');
        
        if (color) {
            logLine.style.color = color;
        }
        
        logLine.innerHTML = message;
        log.appendChild(logLine);
    }

    function clearLog() {
        var log = document.getElementById('info');
        log.innerHTML = '';
    }
    
    function testNotImplemented(testName) {
        return function () {
            console.error(testName, 'test not implemented');
        };
    }
    
    function init() {
        /** set sound extension*/
        switch (cordova.platformId) {
          case "windows":
          case "windows8":
          case "windowsphone":
            PlayerTestSuite.soundExtension = ".wav";
            break;
          case "ios":
            PlayerTestSuite.soundExtension = ".caf";
            break;
          case "android":
            PlayerTestSuite.soundExtension = ".mp3";
            break;
          default:
            PlayerTestSuite.soundExtension = ".mp3";
        }
        
        PlayerTestSuite.soundtrack = "snd/music_main" + ((navigator.userAgent.toUpperCase().indexOf("WINDOWS PHONE")!=-1) ? ".wav" : ".mp3");
        
        PlayerTestSuite.sounds = {
            marioloud: {
                sound: 'snd/marioloud' + PlayerTestSuite.soundExtension,
                count: 2
            },
            fireball: {
                sound: 'snd/fireball' + PlayerTestSuite.soundExtension,
                count: 4
            },
            bigness: {
                sound: 'snd/bigness' + PlayerTestSuite.soundExtension,
                count: 4
            },
            coin: {
                sound: 'snd/coin' + PlayerTestSuite.soundExtension,
                count: 10
            },
            item_rise: {
                sound: 'snd/item_rise' + PlayerTestSuite.soundExtension,
                count: 4
            },
            music_starpower: {
                sound: 'snd/music_starpower' + PlayerTestSuite.soundExtension,
                count: 1
            },
            bullet_bill_shot: {
                sound: 'snd/bullet_bill_shot' + PlayerTestSuite.soundExtension,
                count: 4
            },
            jump_big: {
                sound: 'snd/jump_big' + PlayerTestSuite.soundExtension,
                count: 4
            },
            destroy_block: {
                sound: 'snd/destroy_block' + PlayerTestSuite.soundExtension,
                count: 4
            }
        };
        
        for(var i in PlayerTestSuite.sounds){
            var sound = PlayerTestSuite.sounds[i].sound;
            var count = PlayerTestSuite.sounds[i].count;
            
            console.log('executing::intel.xdk.player.LoadSound');
            console.log('sound:',sound,' - count:',count);
            intel.xdk.player.loadSound(sound, count);
        }
        
        PlayerTestSuite.slider = {};
        PlayerTestSuite.slider.$el = document.getElementById('slider');
        PlayerTestSuite.slider.initialized = false;
        
        document.addEventListener('intel.xdk.player.audio.start',function(evt){
            /** This is throwing an error
             * console.log('event:',evt.type);
             */
            
            PlayerTestSuite.slider.intervalId = intel.xdk.player.watchAudioCurrentTime(function (info) {
                /* here, info also has 0 values, apparently not working */
                if(!PlayerTestSuite.slider.initialized){
                    /* change the slider max value*/
                    PlayerTestSuite.slider.$el.max = info.duration;
                    PlayerTestSuite.slider.initialized = true;
                }

                PlayerTestSuite.slider.$el.value = info.currentTime;
            }, 100);
        });
        
        document.addEventListener('intel.xdk.player.audio.error',function(evt){
            console.log('event:',evt.type);
        });
        
        document.addEventListener('intel.xdk.player.audio.stop',function(evt){
            console.log('event:',evt.type);
            intel.xdk.stopUpdatingAudioTime();
        });
        
        document.addEventListener('intel.xdk.player.sound.load',function(evt){
            console.log('event:',evt.type);
        });
        
        document.addEventListener('intel.xdk.player.sound.unload',function(evt){
            console.log('event:',evt.type);
        });
        
        /** Slider events */
    }
    
    PlayerTestSuite.$markup = '' +
        
        '<h3>Init</h3>' +
        '<div id="buttonStartBackgroundAudio"></div>' +
        'Expected result: ' +
        
        '<h3>Time Slider</h3>' +
        '<input type="range" id="slider" style="width:70%;" step="0.1" class="topcoat-range-input">' +
        
        '<h3>Controls</h3>' +
        '<div id="buttonStopAudio"></div>' +
        'Expected result: should stop playing' +
        '<div id="buttonVolumeUp"></div>' +
        'Expected result: should increase volumen' +
        '<div id="buttonVolumeDown"></div>' +
        'Expected result: should decrease volumen' +
        
        '<h3>Play Sounds</h3>' +
        '<div>' +
            '<select id="selectSoundToPlay">' +
                '<option value="marioloud">marioloud</option>' +
                '<option value="fireball">fireball</option>' +
                '<option value="bigness">bigness</option>' +
                '<option value="coin">coin</option>' +
                '<option value="item_rise">item_rise</option>' +
                '<option value="music_starpower">music_starpower</option>' +
                '<option value="bullet_bill_shot">bullet_bill_shot</option>' +
                '<option value="jump_big">jump_big</option>' +
                '<option value="destroy_block">destroy_block</option>' +
            '</select>' +
        '</div>' +
        '<div id="buttonPlaySound"></div>' +
        'Expected result: should play selected sound' +
        
        '';
        
    contentEl.innerHTML = '<div id="info"></div>' + PlayerTestSuite.$markup;
    
    createActionButton('startAudio()', function () {
        console.log('executing::intel.xdk.startAudio');
        intel.xdk.player.startAudio(PlayerTestSuite.soundtrack, true);
    }, 'buttonStartBackgroundAudio');
    
    createActionButton('!', function () {
        console.log('executing::intel.xdk.stopAudio');
        intel.xdk.player.stopAudio();
    }, 'buttonStopAudio');
    
    createActionButton('+', function () {
        console.log('executing::intel.xdk.setAudioVolume');
        var volume = PlayerTestSuite.volume;
        volume = volume + 0.1;
        volume = volume > 1? 1 : volume;
        PlayerTestSuite.volume = volume;
        intel.xdk.player.setAudioVolume(volume);
        console.log('volume:',PlayerTestSuite.volume);
    }, 'buttonVolumeUp');
    
    createActionButton('-', function () {
        console.log('executing::intel.xdk.setAudioVolume');
        var volume = PlayerTestSuite.volume;
        volume = volume - 0.1;
        volume = volume < 0? 0 : volume;
        PlayerTestSuite.volume = volume;
        intel.xdk.player.setAudioVolume(volume);
        console.log('volume:',PlayerTestSuite.volume);
    }, 'buttonVolumeDown');
    
    createActionButton('playSound()', function () {
        console.log('executing::intel.xdk.playSound');
        var el = document.getElementById('selectSoundToPlay');
        var text = el.options[el.selectedIndex].innerHTML;
        var audio = 'snd/' + text + PlayerTestSuite.soundExtension;
        console.log('playing:',audio);
        intel.xdk.player.playSound(audio);
    }, 'buttonPlaySound');
    
    document.addEventListener('deviceready', init, false);
};