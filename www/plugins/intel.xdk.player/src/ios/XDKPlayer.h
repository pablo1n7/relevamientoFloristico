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

#import <Foundation/Foundation.h>
#import "Cordova/CDV.h"

@interface XDKPlayer : CDVPlugin {
}

//audio (long playing background track with dedicated channel)
- (void)startAudio:(CDVInvokedUrlCommand*)command;   // (strRelativeFileURL, boolLoop)
- (void)stopAudio:(CDVInvokedUrlCommand*)command;
- (void)toggleAudio:(CDVInvokedUrlCommand*)command;
- (void)pauseAudio:(CDVInvokedUrlCommand*)command;
- (void)resumeAudio:(CDVInvokedUrlCommand*)command;
- (void)setAudioVolume:(CDVInvokedUrlCommand*)command;    // (volume)
- (void)updateAudioTime;
- (void)setAudioCurrentTime:(CDVInvokedUrlCommand*)command;    // (time)
- (void)startUpdatingAudioTime:(CDVInvokedUrlCommand*)command;	//(frequency)
- (void)stopUpdatingAudioTime:(CDVInvokedUrlCommand*)command;

//sound (low-latency short sound with plyphonic support)
- (void)playSound:(CDVInvokedUrlCommand*)command;	//(strRelativeFileURL)
- (void)loadSound:(CDVInvokedUrlCommand*)command;	//(strRelativeFileURL, count)
- (void)unloadSound:(CDVInvokedUrlCommand*)command;	//(strRelativeFileURL)
- (void)unloadAllSounds:(CDVInvokedUrlCommand*)command;

//streaming
- (void)playPodcast:(CDVInvokedUrlCommand*)command;	//(strPodcastURL)
- (void)startShoutcast:(CDVInvokedUrlCommand*)command;	//(strStationURL, boolShowPlayer)
- (void)volume:(CDVInvokedUrlCommand*)command;	//(iPercentage)

@end