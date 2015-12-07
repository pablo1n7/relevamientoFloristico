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

package com.intel.xdk.player;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map.Entry;
import java.util.Timer;
import java.util.TimerTask;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;

import android.app.Activity;
import android.content.Context;
import android.content.res.AssetFileDescriptor;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.media.SoundPool;
import android.os.Handler;
import android.util.Log;
import android.util.SparseArray;
import android.webkit.JavascriptInterface;


public class Player extends CordovaPlugin {
    private boolean playingPodcast = false;
    private boolean playingAudio = false;
    public MediaPlayer mediaPlayer = null;
    public String soundName;
    
    protected SoundPool soundPool;
    final private HashMap<String, Integer> soundPoolMapName2Id;
    final private SparseArray<String> soundPoolMapId2Name;
    final private HashMap<String, Boolean> soundPoolShouldPlay;

    private boolean hasLoadSoundCallback = false;
    private int PODCAST_REQUEST_CODE = 0;
    private Timer watchTimer = null;
    private int audioTime = 0;
    private float audioVolume = 1.0f;
    
    private Activity activity = null;
    
    private String currentUrl = null;
    
    public Player(){
        soundPoolMapName2Id = new HashMap<String, Integer>();
        soundPoolMapId2Name = new SparseArray<String>();
        soundPoolShouldPlay = new HashMap<String, Boolean>();
    }

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        
        //get convenience reference to activity
        activity = cordova.getActivity();
        
        //get the current url
        final CordovaWebView wv = webView;
        activity.runOnUiThread(new Runnable() {
            public void run() {
                currentUrl = wv.getUrl();
            }
        });
        
        //turn on remote debugging
        // activity.runOnUiThread(new Runnable() {
        //     public void run() {
        //         if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
        //          try {
        //              Method m = WebView.class.getMethod("setWebContentsDebuggingEnabled", boolean.class);
        //              m.invoke(WebView.class, true);
        //          } catch (Exception e) {
        //              // TODO Auto-generated catch block
        //              e.printStackTrace();
        //          }
        //         }
        //     }
        // });
        
        soundPool = new SoundPool(30, AudioManager.STREAM_MUSIC, 100);
        soundPool.setOnLoadCompleteListener(
            new SoundPool.OnLoadCompleteListener() {
                public void onLoadComplete(SoundPool soundPool, int sampleId, int status) {
                    soundLoaded(sampleId, status);
                }
            }
        );
        hasLoadSoundCallback = true;
    }

    /**
     * Executes the request and returns PluginResult.
     *
     * @param action            The action to execute.
     * @param args              JSONArray of arguments for the plugin.
     * @param callbackContext   The callback context used when calling back into JavaScript.
     * @return                  True when the action was valid, false otherwise.
     */
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("")) {
//            JSONObject r = new JSONObject();
//            r.put("cookies", new JSONObject(getCookies()));
//            r.put("mediacache", new JSONArray(getMediaCache()));
//            r.put("mediacache_dir", cachedMediaDirectory.getAbsolutePath());
//            callbackContext.success(r);
        }
        else if (action.equals("startAudio")) {
            startAudio(args.getString(0), args.getBoolean(1));
        }
        else if (action.equals("toggleAudio")) {
            this.toggleAudio();
        }
        else if (action.equals("stopAudio")) {
            this.stopAudio();
        }
        else if (action.equals("setAudioVolume")) {
            this.setAudioVolume(args.getString(0));
            //this.setAudioVolume((float) args.optDouble(0));
        }
        else if (action.equals("setAudioCurrentTime")) {
            this.setAudioCurrentTime(args.getString(0));
        }
        else if (action.equals("watchAudioCurrentTime")) {
            Log.d("IntelXDKPlayer","watchAudioCurrentTime not implemented");
        }
        else if (action.equals("startUpdatingAudioTime")) {
            this.startUpdatingAudioTime(args.getInt(0));
        }
        else if (action.equals("stopUpdatingAudioTime")) {
            this.stopUpdatingAudioTime();
        }
        else if (action.equals("playSound")) {
            this.playSound(args.getString(0));
        }
        else if (action.equals("loadSound")) {
            this.loadSound(args.getString(0), args.getInt(1));
        }
        else if (action.equals("unloadSound")) {
            this.unloadSound(args.getString(0));
        }
        else if (action.equals("unloadAllSounds")) {
            this.unloadAllSounds();
        }
        else if (action.equals("volume")) {
            Log.d("IntelXDKPlayer","volume not implemented");
            //this.volume(args.getInt(0));
        }
        else if (action.equals("playPodcast")) {
            Log.d("IntelXDKPlayer","playPodcast not implemented");
            //this.playPodcast(args.getString(0));
        }
        else if (action.equals("startShoutcast")) {
            Log.d("IntelXDKPlayer","startShoutcast not implemented");
            //this.startShoutcast(args.getString(0), false);
        }
        else {
            return false;
        }

        return true;
    }

    //--------------------------------------------------------------------------
    // LOCAL METHODS
    //--------------------------------------------------------------------------        
    
    private void injectJS(final String js) {
        activity.runOnUiThread(new Runnable() {
            public void run() {
                webView.loadUrl(js);
            }
        });
    }

    //an abstraction layer for preview vs. prod
    private Object pathToFile(String file) {
        boolean preview = currentUrl.startsWith("file:///android_asset/") == false;
        Object path = null;
        if(!preview) {
            try {
                path = activity.getApplicationContext().getAssets().openFd("www/" + file);
            } catch (Exception e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        } else {
            //get from preview directory
            path = currentUrl.substring("file://".length(), currentUrl.lastIndexOf('/')+1) + file;
        }
        return path;
    }
    
    @Override
    public Object onMessage(String id, Object data) {
        Log.d("IntelXDKPlayer","onMessage, id:"+id+", data:"+data);
        if("onPageFinished".equals(id)) {
            currentUrl = (String)data;
        }
        return super.onMessage(id, data);
    }

    //remove?
    protected void stopCommand() {
        //stop();
        stopAudio();
        //try to stop podcast
        activity.finishActivity(PODCAST_REQUEST_CODE);
    }
    
    //defer?
    @JavascriptInterface
    public void playPodcast(final String strPodcastURL)
    {   
//        String fixedPodcastURL = null;
//        
//        if(isPlayingStation() || isPlayingPodcast() || isPlayingAudio()) {
//            injectJS("javascript:var ev = document.createEvent('Events');ev.initEvent('intel.xdk.player.podcast.busy');document.dispatchEvent(ev);");
//            return;
//        }
//        
//        if(strPodcastURL.startsWith("http://") == false) {
//            //try to find on local system
//            File podcast = new File(activity.appDir(), strPodcastURL);
//            if(podcast.exists()) {
//                //rewrite url to use localhost
//                //switch to webview.rootDir instead of building manually
//                StringBuffer rewrittenURL = new StringBuffer("http://localhost:58888/");
//                rewrittenURL.append(webview.config.appName);
//                rewrittenURL.append('/');
//                rewrittenURL.append(webview.config.releaseName);
//                if(strPodcastURL.charAt(0)!='/') rewrittenURL.append('/');
//                rewrittenURL.append(strPodcastURL);
//                
//                fixedPodcastURL = rewrittenURL.toString();
//            }
//        } else {
//            fixedPodcastURL = strPodcastURL;
//        }
//        
//        if( fixedPodcastURL == null ) {
//            injectJS("javascript:var ev = document.createEvent('Events');ev.initEvent('intel.xdk.player.podcast.error',true,true);document.dispatchEvent(ev);");
//            return;
//        }
//        
//        setPlayingPodcast(true);
//        injectJS("javascript:var ev = document.createEvent('Events');ev.initEvent('intel.xdk.player.podcast.start',true,true);document.dispatchEvent(ev);");
//        Intent i = new Intent(activity, PodcastActivity.class);
//        i.putExtra("url",fixedPodcastURL);
//        activity.setLaunchedChildActivity(true);
//        activity.startActivityForResult(i, PODCAST_REQUEST_CODE);
    }
    
    
    private MediaPlayer.OnErrorListener soundOnError = new MediaPlayer.OnErrorListener(){
        //@Override
        public boolean onError(MediaPlayer mp, int what, int extra) {
            injectJS("javascript:var ev = document.createEvent('Events');ev.initEvent('intel.xdk.player.audio.error',true,true);document.dispatchEvent(ev);");
            setPlayingAudio(false);
            return true;
        }
    };    

    private MediaPlayer.OnCompletionListener soundOnComplete = new MediaPlayer.OnCompletionListener(){
        //@Override
        public void onCompletion(MediaPlayer mp) {
            setPlayingAudio(false);
            mediaPlayer.release();
            mediaPlayer = null;
            injectJS("javascript:var ev = document.createEvent('Events');ev.initEvent('intel.xdk.player.audio.stop',true,true);document.dispatchEvent(ev);");
            
            //activity.trackPageView("/intel.xdk.podcast." + getAudioName(soundName) + ".stop");
        }
    };
    
    public int loadSound(String strRelativeFileURL, int count) {
        return loadSound(strRelativeFileURL);
    }
    
    public int loadSound(String strRelativeFileURL) {
        Object path = pathToFile(strRelativeFileURL);
        
        Integer id = soundPoolMapName2Id.get(strRelativeFileURL);
        
        if( id == null ) {
            if(path instanceof AssetFileDescriptor) {
                id = soundPool.load((AssetFileDescriptor)path, 1);
            } else {
                id = soundPool.load((String)path, 1);
            }
            //an id of 0 means unable to load the sound
            soundPoolMapName2Id.put(strRelativeFileURL, id);
            soundPoolMapId2Name.put(id, strRelativeFileURL);
            soundPoolShouldPlay.put(strRelativeFileURL, false);
        }
        
        return id;
    }
    
    protected void soundLoaded(int id, int status) {
        String strRelativeFileURL = soundPoolMapId2Name.get(id);
        boolean shouldPlay = soundPoolShouldPlay.get(strRelativeFileURL) && status==0;
        
        if(shouldPlay) {
            playSoundById(id);
        } else {
            StringBuffer js = new StringBuffer("javascript:var ev = document.createEvent('Events');ev.initEvent('intel.xdk.player.sound.load',true,true);ev.name='");
            js.append(strRelativeFileURL);
            js.append("';ev.success=");
            js.append(id!=0 && status==0);
            js.append(";document.dispatchEvent(ev);");
    
            injectJS(js.toString());
        }
    }
    
    public void unloadSound(String strRelativeFileURL) {
        boolean didUnload = false;
        
        Integer id = soundPoolMapName2Id.get(strRelativeFileURL);
        if( id != null ) {
            didUnload = soundPool.unload(id.intValue());
            //didUnload is always false??
            soundPoolMapName2Id.remove(strRelativeFileURL);
            soundPoolMapId2Name.remove(id);
            soundPoolShouldPlay.remove(strRelativeFileURL);
        }
        
        StringBuffer js = new StringBuffer("javascript:var ev = document.createEvent('Events');ev.initEvent('intel.xdk.player.sound.unload',true,true);ev.name='");
        js.append(strRelativeFileURL);
        js.append("';e.success=");
        js.append(didUnload);
        js.append("document.dispatchEvent(ev);");

        injectJS(js.toString());
    }
    
    public void unloadAllSounds() {
        
        Iterator<Entry<String, Integer>> soundPoolNamesAndIdsIter = soundPoolMapName2Id.entrySet().iterator();
        while(soundPoolNamesAndIdsIter.hasNext()) {
            Entry<String,Integer> nameAndId = soundPoolNamesAndIdsIter.next();
            Integer id = nameAndId.getValue();
            String key = nameAndId.getKey();
            soundPoolMapName2Id.remove(key);
            soundPoolMapId2Name.remove(id);
            soundPoolShouldPlay.remove(key);
        }
        soundPool.release();
        soundPool = null;
        soundPool = new SoundPool(30, AudioManager.STREAM_MUSIC, 100);
        
//      StringBuffer js = new StringBuffer("javascript:var ev = document.createEvent('Events');ev.initEvent('intel.xdk.player.sound.unload',true,true);ev.name='");
//      js.append(strRelativeFileURL);
//      js.append("';e.success=");
//      js.append(didUnload);
//      js.append("document.dispatchEvent(ev);");
//
//      injectJS(js.toString());
    }
    
    public void playSound(final String strRelativeFileURL) {
        Integer id = soundPoolMapName2Id.get(strRelativeFileURL);

        if( id == null ) {
            Object path = pathToFile(strRelativeFileURL);
            if(path instanceof AssetFileDescriptor) {
                id = soundPool.load((AssetFileDescriptor)path, 1);
            } else {
                id = soundPool.load((String)path, 1);
            }
            if( id == 0 ) {  // unable to load the sound
                return;
            }
            soundPoolMapName2Id.put(strRelativeFileURL, id);
            soundPoolMapId2Name.put(id, strRelativeFileURL);
            soundPoolShouldPlay.put(strRelativeFileURL, true);
            
            //hack for pre-froyo: wait 250 ms to play sound first time through
            if (!hasLoadSoundCallback) {
                final int soundId = id;
                Handler handler = new Handler();
                handler.postDelayed(new Runnable() {

                    public void run() {
                        soundLoaded(soundId, 0);
                    }
                    
                }, 250);
            }
        } else {
            playSoundById(id.intValue());
        }
    }

    public void playSoundById(final int id) {
        AudioManager mgr = (AudioManager) activity.getSystemService(Context.AUDIO_SERVICE);
        int streamVolume = mgr.getStreamVolume(AudioManager.STREAM_MUSIC);
        int streamMaximum = mgr.getStreamMaxVolume(AudioManager.STREAM_MUSIC);
        float volume = (float)streamVolume / (float)streamMaximum;
        int playingSound = soundPool.play(id, volume, volume, 0, 0, 1f);
        //should inject playingSound so it can be stopped/paused/resumed?
    }
    
    public void setAudioVolume(final float vol)
    {
        if( mediaPlayer != null )
        {
            float volume = vol; 
            volume = Math.max(0.0f, volume);
            volume = Math.min(1.0f, volume);
            audioVolume = volume;
            mediaPlayer.setVolume(audioVolume, audioVolume);
        }
        StringBuffer js = new StringBuffer("javascript:var ev = document.createEvent('Events');ev.initEvent('intel.xdk.player.audio.volume.set',true,true);e.success=");
        js.append((mediaPlayer == null) ? "false" : "true");
        js.append("document.dispatchEvent(ev);");
        injectJS(js.toString());
    }
    
    public void setAudioCurrentTime(String time) {
        float current = 0.0f;
        float length = 0.0f;

        this.audioTime = (int)(Float.parseFloat(time)*1000);
        if( mediaPlayer != null && mediaPlayer.isPlaying()) {
            mediaPlayer.seekTo(audioTime);
            current = (float)mediaPlayer.getCurrentPosition()/1000.0f;
            length = (float)mediaPlayer.getDuration()/1000.0f;
        }
        
        final String js = String.format(
                "javascript: intel.xdk.player.audioInfo = {currentTime:%f, duration:%f};" +
                "var e = document.createEvent('Events');e.initEvent('intel.xdk.player.audio.currenttime.set',true,true);document.dispatchEvent(e);", current, length);
        activity.runOnUiThread(new Runnable() {
            public void run() {
                webView.loadUrl(js);
            }
        });
    }

    class WatchAudioTask extends TimerTask {
        public void run() {
            float current = 0.0f;
            float length = 0.0f;

            try
            {
                if( mediaPlayer != null && mediaPlayer.isPlaying()) {           
                    current = (float)mediaPlayer.getCurrentPosition()/1000.0f;
                    length = (float)mediaPlayer.getDuration()/1000.0f;
                }
            }
            catch(Exception ex) { }
            
            final String js = String.format("javascript: intel.xdk.player.audioInfo = {currentTime:%f, duration:%f};", current, length);
            activity.runOnUiThread(new Runnable() {
                public void run() {
                    webView.loadUrl(js);
                }
            });
        }
    }
    
    public void startUpdatingAudioTime(final int time)
    {
        if( watchTimer != null )
        {
            watchTimer.cancel();
            watchTimer.purge();
        }
        else
        {
            watchTimer = new Timer();
        }
        
        watchTimer.schedule(new WatchAudioTask(), time, time);
    }
    
    public void stopUpdatingAudioTime()
    {
        if( watchTimer != null )
        {
            watchTimer.cancel();
            watchTimer.purge();
            watchTimer = null;
        }
    }

    public void startAudio(String strRelativeFileURL, boolean shouldLoop) {
        if (isPlayingPodcast()) {
            injectJS("javascript:var ev = document.createEvent('Events');ev.initEvent('intel.xdk.player.audio.busy',true,true);document.dispatchEvent(ev);");
            return;
        } else if (isPlayingAudio()) {
            stopAudio();
        }
        
        soundName = strRelativeFileURL;
        Object path = pathToFile(strRelativeFileURL);

        try {
            try {
                if(mediaPlayer!=null) {
                    mediaPlayer.release();
                    mediaPlayer = null;
                }
            } catch(Exception e) {}
            mediaPlayer = new MediaPlayer();
            mediaPlayer.setLooping(shouldLoop);
            mediaPlayer.setOnErrorListener(soundOnError);
            mediaPlayer.setOnCompletionListener(soundOnComplete);
            
            //set data source based on type
            if(path instanceof AssetFileDescriptor) {
                try {
                    AssetFileDescriptor afd = ((AssetFileDescriptor)path);
                    mediaPlayer.setDataSource(afd.getFileDescriptor(),afd.getStartOffset(),afd.getLength());
                } catch (FileNotFoundException e1) {
                    e1.printStackTrace();
                } catch (IOException e) {
                    e.printStackTrace();
                }       
            } else {
                File file = new File((String)path);
                try {
                    FileInputStream fis = new FileInputStream(file);
                    mediaPlayer.setDataSource(fis.getFD());
                } catch (FileNotFoundException e) {
                    e.printStackTrace();
                }
            }
            
            mediaPlayer.prepare();
            mediaPlayer.seekTo(audioTime);
            mediaPlayer.setVolume(audioVolume, audioVolume);
            mediaPlayer.start();
        }
        catch (Exception e) {
            injectJS("javascript:var ev = document.createEvent('Events');ev.initEvent('intel.xdk.player.audio.error',true,true);document.dispatchEvent(ev);");
            return;
        }       
        
        //activity.trackPageView("/intel.xdk.podcast." + getAudioName(soundName) + ".stop");
        
        setPlayingAudio(true);
        injectJS("javascript:var ev = document.createEvent('Events');ev.initEvent('intel.xdk.player.audio.start');document.dispatchEvent(ev);");  
    }
    
    public void toggleAudio()
    {
        if( mediaPlayer != null )
        {
            if( mediaPlayer.isPlaying() ) {
                audioTime = mediaPlayer.getCurrentPosition();
                mediaPlayer.pause();
            }
            else {
                mediaPlayer.seekTo(audioTime);
                mediaPlayer.start();
            }
        }
    }
    
    public void stopAudio()
    {
        if( mediaPlayer != null )
        {
            try {
                mediaPlayer.stop();
                mediaPlayer = null;
                injectJS("javascript:var ev = document.createEvent('Events');ev.initEvent('intel.xdk.player.audio.stop',true,true);document.dispatchEvent(ev);");
            } catch (IllegalStateException e) {
                e.printStackTrace();
            }
        }
        setPlayingAudio(false);
    }
    
    private String getAudioName(String url)
    {
        String name = "";
        int last = url.lastIndexOf("/");
        if( last > 0 )
        {
            name = url.substring(last + 1);
        }
        
        return name;
    }
    
    boolean firstTime = true;
    int volPercen=-1; 
    
    //defer
    public void volume(int iVolumePercentage)
    {       
//        if(firstTime){
//            volPercen = iVolumePercentage;
//            firstTime =false;
//            return;
//        }
//        
//        //showMessage("playerFfwd: " + iVolumePercentage + "%");
//        if(iVolumePercentage>volPercen){            
//            volPercen = iVolumePercentage;
//            Message message = new Message();
//            message.what = FlyCastPlayer.PLAYER_VOLUME_UP;
//            activity.nonGUIUpdateHandler.sendMessage(message);
//            
//        }
//        else{
//            volPercen = iVolumePercentage;
//            
//            Message message = new Message();
//            message.what = FlyCastPlayer.PLAYER_VOLUME_DOWN;
//            activity.nonGUIUpdateHandler.sendMessage(message);
//        }           
    }
    
    //defer
    public void startShoutcast(String strShoutcastURL, boolean showPlayer)
    {
//        //check auth
//        if(webview.config!=null && !webview.config.hasStreaming) return;
//        
//        // Need new code to make this work
//        if(Debug.isDebuggerConnected()) Log.d("LifeCycle", "PhoneGap::startShoutcast");
//        if(isPlayingPodcast() || isPlayingAudio()) {
//            injectJS("javascript:var ev = document.createEvent('Events');ev.initEvent('intel.xdk.player.shoutcast.busy');document.dispatchEvent(ev);");
//            return;
//        } 
//        else if(activity.state.playStarted && strShoutcastURL!=null && FlyCastPlayer.shoutcastURL!=null && strShoutcastURL.equalsIgnoreCase(FlyCastPlayer.shoutcastURL) ){
//            if(Debug.isDebuggerConnected()) Log.d("ShoutCast", "request to play same station returning...");
//            return;
//        } else if(!checkSDCard()) {
//            injectJS("javascript:var ev = document.createEvent('Events');ev.initEvent('intel.xdk.player.shoutcast.error');document.dispatchEvent(ev);");
//            return;         
//        }
//        else if(strShoutcastURL.equals("")){
//            injectJS("javascript:var ev = document.createEvent('Events');ev.initEvent('intel.xdk.player.shoutcast.error');document.dispatchEvent(ev);");
//            return;
//        }
//        
//        int index = strShoutcastURL.indexOf(".pls");
//        if( index > -1 )
//        {
//            HttpEntity entity = null;
//            HttpResponse response = null;
//            try {
//                DefaultHttpClient httpclient = new DefaultHttpClient();
//                HttpGet httpget = new HttpGet(strShoutcastURL);
//                httpget.addHeader("User-Agent", "WinampMPEG/5.35");
//                response = httpclient.execute(httpget);
//                entity = response.getEntity();
//            } catch (Exception e) {
//                if(Debug.isDebuggerConnected()) {
//                    Log.d("[intel.xdk.player]", "unable to retrieve .pls" + e.getMessage(), e);
//                }
//            }
//
//            if(response!=null && response.getEntity()!=null)
//            {               
//                String responseBody = null;
//                try {
//                    responseBody = activity.appView.device._getResponseBody(entity, false);
//                } catch (Exception e)
//                {
//                    if(Debug.isDebuggerConnected()) {
//                        Log.d("[intel.xdk.player]", "unable to retrieve .pls" + e.getMessage(), e);
//                    }           
//                }
//                
//                if( responseBody != null )
//                {
//                    int file = 1;
//                    String listItems[] = responseBody.split("([ \\t\\r]*\\n[ \\t\\r]*)+");
//                    for( int i = 0; i < listItems.length; i++ )
//                    {
//                        String marker = ("File" + file + "=").toUpperCase();
//                        int where = listItems[i].toUpperCase().indexOf(marker);
//                        if( where > -1 )
//                        {
//                            strShoutcastURL = listItems[i].substring(where+marker.length());
//                            break;
//                        }
//                    }
//                }
//            }           
//        }
//        
//        //FlyCastPlayer.shoutcastURL = strShoutcastURL;
//        
//        //System.err.println( "ROSCO ** [" + strShoutcastURL + "] NEW SHOUTCAST URL" );
//            
//        //By Parveen - Set player visibility player accordingly here.
//        activity.state.showPlayer = showPlayer;
//        
//        Message message = new Message();
//        message.obj = strShoutcastURL;
//        message.what = FlyCastPlayer.START_SHOUTCAST;
//        activity.nonGUIUpdateHandler.sendMessage(message);
//        setPlayingStation(true);
    }


    public void setPlayingPodcast(boolean playingPodcast) {
        this.playingPodcast = playingPodcast;
    }

    public boolean isPlayingPodcast() {
        return playingPodcast;
    }

    public void setPlayingAudio(boolean playingAudio) {
        this.playingAudio = playingAudio;
    }

    public boolean isPlayingAudio() {
        return playingAudio;
    }

    private boolean checkSDCard() {
        boolean ok = true;
//        String title = null, message = null;
//        if(!DPMemoryStatus.externalMemoryAvailable()){
//            ok = false;
//            title = "No SD card";
//            message = "Streaming is not available because this device does not have an SD card.\nInstall an SD card to enable streaming.";
//        } else if (DPMemoryStatus.getAvailableExternalMemorySize() < 4000000){
//            ok = false;
//            title = "SD card full";
//            message = "Streaming is not available because the SD card installed in this device is full.\nFree some space on the SD card to enable streaming.";
//        }
//        
//        if(!ok) {
//            new AlertDialog.Builder(activity)
//            .setTitle(title)
//            .setMessage(message)
//            .setNeutralButton("Close",
//                new DialogInterface.OnClickListener() {
//                    public void onClick(DialogInterface dialog, int id) {
//                        dialog.cancel();
//                    }
//            }).show();
//        }
//        
        return ok;
    }
    
    public void setAudioVolume(String volume)
    {
        //Valid volumes 0.0 to 1.0
        double castVol = Float.parseFloat(volume);
        if(castVol > 1.0)
            castVol = 1.0;
        // Get the AudioManager
        AudioManager audioManager = (AudioManager)activity.getSystemService(Context.AUDIO_SERVICE);
        int newVol = (int) (audioManager.getStreamMaxVolume(AudioManager.STREAM_MUSIC) * castVol);
        // Set the volume of played media to maximum.
        audioManager.setStreamVolume(AudioManager.STREAM_MUSIC, newVol,0);
        
        String js = "javascript: var e = document.createEvent('Events');e.initEvent('intel.xdk.player.audio.volume.set',true,true);document.dispatchEvent(e);";
        injectJS(js);
    }
}

//removed
//public boolean isPlayingStation()
//public void setPlayingStation(boolean playingStation)
//public void startStation(String strStationID, boolean resumeMode, boolean showPlayer)
//public void play()
//public void pause()
//public void stop()
//public void rewind()
//public void ffwd()
//public void setColors(String strBackColor, String strFillColor, String strDoneColor, String strPlayColor)
//public void setPosition(int portraitX, int portraitY, int landscapeX, int landscapeY) {
//public void show()
//public void hide()

