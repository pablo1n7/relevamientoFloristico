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

#import "XDKPlayer.h"
#import <AVFoundation/AVFoundation.h>
#import <AudioToolbox/AudioToolbox.h>

@interface XDKPlayer () <AVAudioPlayerDelegate, UIAlertViewDelegate>

@property (nonatomic) NSTimer* audioUpdateTimer;
@property (nonatomic) NSLock* lkUpdateAudioData;
@property (nonatomic) NSMutableDictionary* testLocalCached;
@property (nonatomic) NSMutableDictionary* soundPool;
@property (nonatomic) AVAudioPlayer* audioPlayer;
@property float audioPlayerCurrentTime;
@property float audioPlayerCurrentVolume;

@end

@implementation XDKPlayer

#pragma mark Private

// Send the OK plugin result back to Cordova.
- (void)reportOKWithCommand:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult* ok = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:ok callbackId:command.callbackId];
}

- (void)fireEvent:(NSString *)jsevent
{
    NSString *strEvent =  [NSString stringWithFormat:@"var ev = document.createEvent('Events');ev.initEvent('%@',true,true);document.dispatchEvent(ev);", jsevent];
    [self.commandDelegate evalJs:strEvent];
}

//this was used to support the old approach to local mode - preserving in case we switch back to it
- (void)cacheSoundLocal:(NSString *)strRelativePath
{
    //    NSString *fullPath = [NSString stringWithFormat:@"%@/%@", webView.config.appDirectory, strRelativePath];
    //
    //    BOOL fileExists = [[NSFileManager defaultManager] fileExistsAtPath:fullPath];
    //    BOOL fileCached = ( [testLocalCached objectForKey:strRelativePath] != nil );
    //    if( fileExists == NO || fileCached == NO )
    //    {
    //        NSString *urlString = [[[webView request] URL] description];
    //        NSRange range = [urlString rangeOfString:@"/" options:NSBackwardsSearch];
    //      if( range.location != NSNotFound )
    //        {
    //          NSString *testLocalRoot = [urlString substringToIndex:range.location];
    //            NSString *testLocalUrl = [NSString stringWithFormat:@"%@/%@", testLocalRoot, strRelativePath];
    //
    //            NSRange dirrange = [fullPath rangeOfString:@"/" options:NSBackwardsSearch];
    //            NSString *testLocalPath = [fullPath substringToIndex:dirrange.location];
    //
    //            NSData *data = [NSData dataWithContentsOfURL:[NSURL URLWithString:testLocalUrl]];
    //            if( data != nil && [data length] > 0 )
    //            {
    //                [testLocalCached setObject:strRelativePath forKey:strRelativePath];
    //                [[NSFileManager defaultManager] createDirectoryAtPath:testLocalPath withIntermediateDirectories:YES attributes:nil error:nil];
    //                [[NSFileManager defaultManager] removeItemAtPath:fullPath error:nil];
    //                [[NSFileManager defaultManager] createFileAtPath:fullPath contents:data attributes:nil];
    //            }
    //        }
    //    }
}

- (AVAudioPlayer *)getPlayerFromPool:(NSString *)file {
    //get array of players
    NSMutableArray * players = [self.soundPool objectForKey:file];
    if (players == nil) {
        //create and add if needed
        players = [NSMutableArray arrayWithCapacity:1];
        [self.soundPool setObject:players forKey:file];
        
        //create, prepare and add player
        NSString *fullPath = [self.commandDelegate pathForResource:file];
        
        NSData *data = [fullPath hasPrefix:@"http"] ? [NSData dataWithContentsOfURL:[NSURL URLWithString:fullPath]] : [NSData dataWithContentsOfFile:fullPath];
        
        if( data == nil || [data length] == 0 )
        {
            [self performSelectorOnMainThread:@selector(fireEvent:) withObject:@"intel.xdk.player.sound.error" waitUntilDone:NO];
            return nil;
        }
        
        AVAudioPlayer *player = [[AVAudioPlayer alloc] initWithData:data error:nil];
        [player prepareToPlay];
        int vol = [player volume];
        [player setVolume:0.0];
        [player play];
        [player stop];
        [player setVolume:vol];
        [players addObject:player];
    }
    
    //try get a player that isnt already playing
    AVAudioPlayer *player = nil;
    //hold onto the LRU player in case they are all playing
    AVAudioPlayer *lruPlayer = nil;
    for(int i=0;i<[players count];i++) {
        player = [players objectAtIndex:i];
        if (player.playing == NO) {
            return player;
        }
        if (lruPlayer==nil || (player.currentTime>lruPlayer.currentTime)) {
            lruPlayer = player;
        }
    }
    
    return lruPlayer;
}

- (void)preloadPlayersIntoPool:(NSString *)file withCount:(int)count{
    //create array of players
    NSMutableArray * players = [NSMutableArray arrayWithCapacity:count];
    [self.soundPool setObject:players forKey:file];
    
    //create, prepare and add
    //note that this overwrites any dynamically or previously created players in the pool
    NSString *fullPath = [self.commandDelegate pathForResource:file];
    
    NSData *data = [fullPath hasPrefix:@"http"] ? [NSData dataWithContentsOfURL:[NSURL URLWithString:fullPath]] : [NSData dataWithContentsOfFile:fullPath];
    
    if( data == nil || [data length] == 0 )
    {
        [self performSelectorOnMainThread:@selector(fireEvent:) withObject:@"intel.xdk.player.sound.error" waitUntilDone:NO];
    }
    
    for(int i=0;i<count;i++) {
        AVAudioPlayer *player = [[AVAudioPlayer alloc] initWithData:data error:nil];
        [player prepareToPlay];
        if (i==0) {
            int vol = [player volume];
            [player setVolume:0.0];
            [player play];
            [player stop];
            [player setVolume:vol];
        }
        [players addObject:player];
    }
}

- (void)soundComplete
{
    self.audioPlayer = nil;
    [self performSelectorOnMainThread:@selector(fireEvent:) withObject:@"appMobi.player.audio.stop" waitUntilDone:NO];
}

#pragma mark - AVAudioPlayerDelegate

- (void)audioPlayerDecodeErrorDidOccur:(AVAudioPlayer *)player error:(NSError *)error
{
    [self soundComplete];
}

- (void)audioPlayerDidFinishPlaying:(AVAudioPlayer *)player successfully:(BOOL)flag
{
    [self soundComplete];
}

- (void)audioPlayerEndInterruption:(AVAudioPlayer *)player
{
    [self soundComplete];
}

#pragma mark - CDVPlugin

- (void)pluginInitialize
{
    [super pluginInitialize];
    
    // Initialize lock
    self.lkUpdateAudioData = [[NSLock alloc] init];
    self.testLocalCached = [[NSMutableDictionary alloc] init];
    
    //initialize sound pool
    self.soundPool = [[NSMutableDictionary alloc] init];
    
    //audio
    self.audioPlayerCurrentTime = 0.0;
    self.audioPlayerCurrentVolume = 1.0;
    
}

- (void)onReset
{
     [super onReset];
}

- (void)onAppTerminate
{
    [super onAppTerminate];
}

#pragma mark - Plugin Methods

- (void)stopAudio:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^{
        if(self.audioPlayer != nil) {
            [self.audioPlayer stop];
            [self soundComplete];
        }
        
        [self reportOKWithCommand:command];
    }];
}

- (void)startAudio:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^{
        NSString* strRelativePath = [command argumentAtIndex:0];
        //if( [[AppMobiDelegate sharedDelegate] isTestLocal] == YES ) [self cacheSoundLocal:strRelativeFileURL];
        BOOL boolLoop = [[command argumentAtIndex:1 withDefault:@NO] boolValue];
        
        if(self.audioPlayer != nil) [self.audioPlayer stop];
        NSString *fullPath = [self.commandDelegate pathForResource:strRelativePath];
        
        NSData *data = [fullPath hasPrefix:@"http"] ? [NSData dataWithContentsOfURL:[NSURL URLWithString:fullPath]] : [NSData dataWithContentsOfFile:fullPath];
        if( data == nil || [data length] == 0 )
        {
            [self performSelectorOnMainThread:@selector(fireEvent:) withObject:@"intel.xdk.player.sound.error" waitUntilDone:NO];
            return;
        }
        
        NSError *aderr = nil;
        self.audioPlayer = [[AVAudioPlayer alloc] initWithData:data error:&aderr];
        self.audioPlayer.delegate = self;
        self.audioPlayer.currentTime = self.audioPlayerCurrentTime;
        self.audioPlayer.volume = self.audioPlayerCurrentVolume;
        if(boolLoop)
        {
            self.audioPlayer.numberOfLoops = -1;
        }
        [self.audioPlayer play];
        
        [self performSelectorOnMainThread:@selector(fireEvent:) withObject:@"intel.xdk.player.audio.start" waitUntilDone:NO];
        
        [self reportOKWithCommand:command];
    }];
}

- (void)toggleAudio:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^{
        if(self.audioPlayer != nil) {
            self.audioPlayer.playing?[self.audioPlayer pause]:[self.audioPlayer play];
        }
        
        [self reportOKWithCommand:command];
    }];
}

- (void)pauseAudio:(CDVInvokedUrlCommand*)command {
    [self.commandDelegate runInBackground:^{
        if(self.audioPlayer != nil) [self.audioPlayer pause];
        
        [self reportOKWithCommand:command];
    }];
}

- (void)resumeAudio:(CDVInvokedUrlCommand*)command {
    [self.commandDelegate runInBackground:^{
        if(self.audioPlayer != nil) [self.audioPlayer play];

        [self reportOKWithCommand:command];
    }];
}

- (void)setAudioVolume:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^{
        float volume = [[command argumentAtIndex:0 withDefault:@0.5] floatValue];
        
        [self.lkUpdateAudioData lock];
        if(self.audioPlayer != nil) {
            self.audioPlayer.volume = volume;
        }
        [self performSelectorOnMainThread:@selector(fireEvent:) withObject:@"intel.xdk.player.audio.volume.set" waitUntilDone:NO];
        [self.lkUpdateAudioData unlock];
        
        [self reportOKWithCommand:command];
    }];
}

- (void)setAudioCurrentTime:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^{
        float cTime = [[command argumentAtIndex:0 withDefault:@0.0] floatValue];
        
        [self.lkUpdateAudioData lock];
        if(self.audioPlayer != nil) {
            self.audioPlayer.currentTime = cTime;
        }
        NSString *strJS =  [NSString stringWithFormat:@"intel.xdk.player.audioInfo = {currentTime:%f, duration:%f};", self.audioPlayer!=nil?self.audioPlayer.currentTime:0, self.audioPlayer!=nil?self.audioPlayer.duration:0];
        [self.commandDelegate evalJs:strJS];
        [self performSelectorOnMainThread:@selector(fireEvent:) withObject:@"intel.xdk.player.audio.currenttime.set" waitUntilDone:NO];
        [self.lkUpdateAudioData unlock];
        
        [self reportOKWithCommand:command];
    }];
}

- (void)updateAudioTime
{
    [self.commandDelegate runInBackground:^{
        [self.lkUpdateAudioData lock];
        NSString *strJS =  [NSString stringWithFormat:@"intel.xdk.player.audioInfo = {currentTime:%f, duration:%f};", self.audioPlayer!=nil?self.audioPlayer.currentTime:0, self.audioPlayer!=nil?self.audioPlayer.duration:0];
        [self.commandDelegate evalJs:strJS];
        [self.lkUpdateAudioData unlock];
    }];
}

- (void)startUpdatingAudioTime:(CDVInvokedUrlCommand*)command
{
    float frequency = [[command argumentAtIndex:0 withDefault:@500.0] floatValue]/1000.0;
    
    if(self.audioUpdateTimer!=nil) {
        [self.audioUpdateTimer invalidate];
    }
    self.audioUpdateTimer = [NSTimer scheduledTimerWithTimeInterval:frequency target:self selector:@selector(updateAudioTime) userInfo:nil repeats:YES];
    
    [self reportOKWithCommand:command];
}

- (void)stopUpdatingAudioTime:(CDVInvokedUrlCommand*)command
{
    
    if(self.audioUpdateTimer!=nil) {
        [self.audioUpdateTimer invalidate];
        self.audioUpdateTimer = nil;
    }
    
    [self reportOKWithCommand:command];
}

//sound (low-latency short sound with plyphonic support)
- (void)playSound:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^{
        NSString* strRelativePath =  [command argumentAtIndex:0];
        
        // if( [[AppMobiDelegate sharedDelegate] isTestLocal] == YES ) [self cacheSoundLocal:strRelativePath];
        
        AVAudioPlayer *player = [self getPlayerFromPool:strRelativePath];
        
        if( player != nil )
        {
            //we could add mode behavior here to add another player, restart or drop this request - for now we default to restart
            if( player.playing == NO )
            {
                [player play];
            }
            else
            {
                //cut down on seek thrashing by only resetting after at least half of sound played
                if((player.currentTime/player.duration)>.5){
                    player.currentTime = 0;
                }
            }
        }
        
        [self reportOKWithCommand:command];
    }];
}

- (void)loadSound:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^{
        NSString* strRelativePath =  [command argumentAtIndex:0];
        int count = [[command argumentAtIndex:1 withDefault:@1] intValue];
        
        [self preloadPlayersIntoPool:strRelativePath withCount:count];
        
        [self reportOKWithCommand:command];
    }];
}

- (void)unloadSound:(CDVInvokedUrlCommand*)command
{
    NSString* strRelativePath =  [command argumentAtIndex:0];
    
    [self.soundPool removeObjectForKey:strRelativePath];
    
    [self reportOKWithCommand:command];
}

- (void)unloadAllSounds:(CDVInvokedUrlCommand*)command
{
    
    [self.soundPool removeAllObjects];
    
    [self reportOKWithCommand:command];
}

//streaming
- (void)playPodcast:(CDVInvokedUrlCommand*)command
{
    //(strPodcastURL)
    
    //placeholder
    
    [self reportOKWithCommand:command];
}

- (void)startShoutcast:(CDVInvokedUrlCommand*)command
{
    //(strStationURL, boolShowPlayer)
    
    //placeholder
    
    [self reportOKWithCommand:command];
}

- (void)volume:(CDVInvokedUrlCommand*)command
{
    //(iPercentage)
    
    //placeholder
    
    [self reportOKWithCommand:command];
}

@end
