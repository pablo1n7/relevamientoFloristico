intel.xdk.player
================

For playing audio files.

Description
-----------

The player plugin is used to play media natively in applications. It is a useful
alternative to the HTML5 \<video\> and \<audio\> tags.

### Methods

-   [clearAudioCurrentTimeWatch](#clearaudiocurrenttimewatch) — Stop an audio
    track watch.
-   [loadSound](#loadsound) — Preload a sound file.
-   [playSound](#playsound) — Play a sound with no UI, events, or control.
-   [setAudioCurrentTime](#setaudiocurrenttime) — Change the current play
    position in an audio file.
-   [setAudioVolume](#setaudiovolume) — Change the player volume for an audio
    file.
-   [startAudio](#startaudio) — Play an audio file in the background.
-   [stopAudio](#stopaudio) — Stop playing an audio file.
-   [toggleAudio](#toggleaudio) — Pause or restart an audio file.
-   [unloadAllSounds](#unloadallsounds) — Unload all sound files.
-   [unloadSound](#unloadsound) — Unload a sound file.
-   [watchAudioCurrentTime](#watchaudiocurrenttime) — Watch the time of
    the current audio file.

### Properties

-   [audioInfo](#audioinfo) — Information about the currently playing audio
    file.

### Events

-   [intel.xdk.player.audio.currenttime.set](#audiocurrenttimeset) — Execution
    of [setAudioCurrentTime](#setaudiocurrenttime) is complete.
-   [intel.xdk.player.audio.currenttime.set](#audiovolumeset) — Execution
    of [setAudioVolume](#setaudiocolume) is complete.
-   [intel.xdk.player.audio.error](#audioerror) — An error occurred when trying
    to play an audio file.
-   [intel.xdk.player.audio.start](#audiostart) — An audio file has started
    playing.
-   [intel.xdk.player.audio.stop](#audiostop) — An audio file has finished
    playing or been stopped.
-   [intel.xdk.player.sound.error](#sounderror) — [playSound](#playsound)
    was called with an invalid or missing file.

Methods
-------

### clearAudioCurrentTimeWatch

Stop a timer process that was started by a call to
[watchAudioCurrentTime](#watchaudiocurrenttime).

```javascript
intel.xdk.player.clearAudioCurrentTimeWatch(watchID);
```

#### Platforms

-   Apple iOS
-   Google Android

#### Parameters

**watchID:** The watch identifier that was returned by a call to
[watchAudioCurrentTime](#watchaudiocurrenttime).

#### Example

```javascript
var watchID = intel.xdk.player.watchAudioCurrentTime(onSuccess, 3000);
// ...  some time later ...
intel.xdk.player.clearAudioCurrentTimeWatch(watchID);

```

### loadSound

Preload a sound file.

```javascript
intel.xdk.player.loadSound(soundURL, count);
```

#### Description

This method preloads a sound file so that it can be played without a delay when
it is needed. The sound file must be included within the application file
folder. Valid audio formats depend on the device that the app is running on.

Call this method when the application is not busy with other processes. For
example, load sounds that will be needed at startup when the Cordova
`deviceready` event fires. Then, while switching between levels of a game,
unload sounds that are no longer needed and load new sounds.

Once a sound has been loaded, it can be played by calling
[playSound](#playsound).

#### Available Platforms

-   Apple iOS
-   Google Android
-   Microsoft Windows 8 - BETA
-   Microsoft Windows Phone 8 - BETA

#### Parameters

-   **soundURL:** The URL of the sound file to play relative to the root folder
    of the application.
-   **count:** The polyphonic count of the sound — that is, how many instances
    of the sound can be playing simultaneously. This parameter is optional, and
    defaults to 1.

#### Events

-   **[intel.xdk.player.sound.error](#sounderror):** The file referenced by
    **soundURL** is invalid or missing.

#### Example

```javascript
intel.xdk.player.loadSound("sounds/boing.wav",5);
intel.xdk.player.loadSound("sounds/jump.wav");

function loadSoundError()
{
    alert("Sound file could not be loaded");
}

document.addEventListener("intel.xdk.player.sound.error",loadSoundError,false);
```

### playSound

Play a sound with no UI, events, or control.

```javascript
intel.xdk.player.playSound(soundURL);
```

#### Description

This method will start playing a sound with no user control, no program control,
and no events. (Compare [startAudio](#startaudio).) It is intended as a simple
way to play sound effects in your application. The sound file must be included
within the application file folder. Valid audio formats depend on the device
that the app is running on.

If the sound has been preloaded with [loadSound](#loadsound), it will start 
playing immediately; otherwise, there may be a delay while it is loaded.

A call to [playSound](#playsound) will be ignored if the number of occurrences
of the specified sound that are already being played is greater than or equal to
its polyphonic count. If the sound was not preloaded, its polyphonic count is 1.

#### Available Platforms

-   Apple iOS
-   Google Android
-   Microsoft Windows 8 - BETA
-   Microsoft Windows Phone 8 - BETA

#### Parameters

-   **soundURL:** The URL of the sound file to play relative to the root folder
    of the application.

#### Events

-   **[intel.xdk.player.sound.error](#sounderror):** The file referenced by
    **soundURL** is invalid or missing.

#### Example

```javascript

// play the sound
intel.xdk.player.playSound("sounds/boing.wav");
```

### setAudioCurrentTime

Change the current play position in an audio file.

```javascript
intel.xdk.player.setAudioCurrentTime(time);
```

#### Description

This method causes the player to jump to the specified time in the currently
playing audio file. If no audio file is currently playing, the effect of calling
this method is undefined.

>   **NOTE:** This is an asynchronous operation. After a call to
>   `setAudioCurrentTime`, [watchAudioCurrentTime](#watchaudiocurrenttime)
>   callbacks and the value of the [player.audioInfo](#playeraudioinfo) property
>   are invalid until an [audio.currenttime.set](#audiocurrenttimeset) event
>   occurs.

#### Available Platforms

-   Apple iOS
-   Google Android
-   Microsoft Windows 8 - BETA
-   Microsoft Windows Phone 8 - BETA

#### Parameters

-   **time:** A floating point value that specifies the time in seconds where
    the player should continue or where new audio files should start playing.

#### Events

-   **[intel.xdk.player.audio.currenttime.set](#audiocurrenttimeset):** The
    audio player has been restarted at the specified time.
    [watchAudioCurrentTime](#watchaudiocurrenttime) callbacks and the
    [player.audioInfo](#playeraudioinfo) property are valid again.

#### Example

```javascript
// Set Audio to start at 30 seconds into the file
intel.xdk.player.startAudio("sounds/file1.mp3",false);
intel.xdk.player.setAudioCurrentTime(30);
```

### setAudioVolume

Change the volume at which an audio file is played.

```javascript
intel.xdk.player.setAudioVolume(volume);
```

#### Description

This method causes the player volume to be changed.

#### Available Platforms

-   Apple iOS
-   Google Android
-   Microsoft Windows 8 - BETA
-   Microsoft Windows Phone 8 - BETA

#### Parameters

-   **volume:** A floating point value between `0.0` (muted) and `1.0` (maximum 
    volume)..

#### Events

-   **[intel.xdk.player.audio.volume.set](#audiovolumeset):** The
    audio player volume has been changed.

#### Example

```javascript
// Set Audio to play at 75% volume.
intel.xdk.player.startAudio("sounds/file1.mp3",false);
intel.xdk.player.setAudioVolume(0.75);
```

### startAudio

Play an audio file in the background.

```javascript
intel.xdk.player.startAudio(audioURL, looping);
```

#### Description

This method will load and start playing a specified audio file without any UI,
but with events and programmatic control. (Compare [playSound](#playsound).) It
is useful for adding a response to an application event or for playing a
background audio file while the user performs other actions.

If an audio file is already being played, then the current audio file will be
stopped and the new one will be started.

#### Available Platforms

-   Apple iOS
-   Google Android
-   Microsoft Windows 8 - BETA
-   Microsoft Windows Phone 8 - BETA

#### Parameters

-   **audioURL:** The URL of the audio file to play relative to the root folder
    of the application.
-   *looping:** A Boolean parameter specifying whether the audio should loop.
    Defaults to false.

#### Events

-   **[intel.xdk.player.audio.start](#audiostart):** An audio file has started
    playing.
-   **[intel.xdk.player.audio.stop](#audiostop):** An audio file has finished
    playing or been stopped.
-   **[intel.xdk.player.audio.error](#audioerror):** An error occurred when
    trying to play an audio file.

#### Example

```javascript
// start playing an audio file without looping
intel.xdk.player.startAudio("sounds/cowbell.wav",false);
```

### stopAudio

Stop playing an audio file.

```javascript
intel.xdk.player.stopAudio();
```

#### Description

This method will stop the playing og an audio file previously created by a call
to [startAudio](#startaudio). If no audio file is currently playing, then a call
to this method will not have any effect.

#### Available Platforms

-   Apple iOS
-   Google Android
-   Microsoft Windows 8 - BETA
-   Microsoft Windows Phone 8 - BETA

#### Events

-   **[intel.xdk.player.audio.stop](#audiostop):** An audio file has finished
    playing or been stopped.
-   **[intel.xdk.player.audio.error](#audioerror):** An error occurred when
    trying to stop playing an audio file.

#### Example

```javascript
// stop playback of the audio
intel.xdk.player.stopAudio();
```

### toggleAudio

Pause or resume playing an audio file.

```javascript
intel.xdk.player.toggleAudio();
```

#### Description

-   If an audio file is currently playing, it will be paused.
-   If an audio file is currently paused, it will resume playing.
-   If there is no current audio either playing or paused, then this method will
    not have any effect.

#### Available Platforms

-   Apple iOS
-   Google Android
-   Microsoft Windows 8 - BETA
-   Microsoft Windows Phone 8 - BETA

#### Example

```javascript
// toggle playback of the audio
intel.xdk.player.toggleAudio();
```

### unloadAllSounds

Unload all sound files.

```javascript
intel.xdk.player.unloadAllSounds();
```

#### Description

This method unloads unload all sound files that have been loaded with the
[loadSound](#loadsound) or [playSound](#playsound) methods. Unloading sound
files will free up application memory.

#### Available Platforms

-   Apple iOS
-   Google Android
-   Microsoft Windows 8 - BETA
-   Microsoft Windows Phone 8 - BETA

#### Example

```javascript
intel.xdk.player.unloadAllSounds();
```

### unloadSound

Unload a sound file.

```javascript
intel.xdk.player.unloadSound(soundURL);
```

#### Description

This method unloads a single a sound file. Unloading sound files will free up
application memory.

#### Available Platforms

-   Apple iOS
-   Google Android
-   Microsoft Windows 8 - BETA
-   Microsoft Windows Phone 8 - BETA

#### Parameters

-   **soundURL:** The URL of the sound file to be unloaded relative to the root
    folder of the application.

#### Example

```javascript
intel.xdk.player.unloadSound("sounds/boing.wav");
```

### watchAudioCurrentTime

Start watching the time of the current audio file.
```javascript
var watchID = intel.xdk.player.watchAudioCurrentTime(callback, interval);
```

#### Description

This method starts regularly updating the plugin’s [audioInfo](#audioinfo)
property. It can optionally specify a callback to be called with the
[audioInfo](#audioinfo) property as an argument at each update.

To cancel the watch, call
[clearAudioCurrentTimeWatch](#clearaudiocurrenttimewatch) with the identifier
returned by this method.

#### Platforms

-   Apple iOS
-   Google Android

#### Parameters

-   **callback:** A function that will be called at the specified time interval,
    with the plugin’s [audioInfo](#audioinfo) property as an argument. May be
    `nil`.
-   **interval:** The time interval in milliseconds at which to update the
    [audioInfo](#audioinfo) property and call the callback function.

#### Returns

-   A unique identifier that can be passed as an argument to
    [clearAudioCurrentTimeWatch](#clearaudiocurrenttimewatch) to cancel the
    watch.

#### Example

```javascript

function onSuccess(info) {
    alert('Track Position: ' + info.currentTime + '\n' +
          'Track Duration: ' + info.duration + '\n');
}

// start a watch on the current audio track
var watchID = intel.xdk.player.watchAudioCurrentTime(onSuccess, 3000);

```

Properties
----------

### audioInfo

An object with the following properties describing the currently playing audio
file. This property is only defined if
[watchAudioCurrentTime](#watchaudiocurrenttime) has been called, in which case
it is updated regularly at the interval specified in the call.

-   **currentTime:** The current offset (in seconds) from the beginning of the
    currently playing audio file. Note that this property will temporarily be
    invalid following a call to [setAudioCurrentTime](#setaudiocurrenttime).

-   **duration:** The length (in seconds) of the currently playing audio file.

Events
------

### audio.currenttime.set

Execution of [setAudioCurrentTime](#setaudiocurrenttime) is complete.

#### Description

This event is fired when execution of
[setAudioCurrentTime](#setaudiocurrenttime) is complete. It signifies that the
[watchAudioCurrentTime](#watchaudiocurrenttime) callback and the
[audioInfo](#audioinfo) variable are again valid.

### audio.volume.set

Execution of [setAudioVolume](#setaudiovolume) is complete.

#### Description

This event is fired when execution of [setAudioVolume](#setaudiovolume) is
complete

### audio.error

An error occurred when trying to play an audio file.

#### Description

This event fires when there is an error in a call to [startAudio](#startaudio).

### audio.start

An audio file has started playing.

#### Description

This event is fired when the [startAudio](#startaudio) method successfully
starts playing an audio file.

### audio.stop

An audio file has finished playing or been stopped.

#### Description

This event will fire when an audio file that was played by a call to
[startAudio](#startaudio) stops playing because it has reached the end or
[stopAudio](#stopaudio) was called.

### sound.error

The file specified in the [playSound](#playsound) command is invalid or missing.

#### Description

This event fires if the file specified in a call to [playSound](#playsound)
is invalid or missing.
