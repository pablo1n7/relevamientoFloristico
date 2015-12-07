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

using Microsoft.Phone.Tasks;
using Microsoft.Xna.Framework.Audio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Resources;
using WPCordovaClassLib.Cordova;
using WPCordovaClassLib.Cordova.Commands;
using WPCordovaClassLib.CordovaLib;

namespace Cordova.Extension.Commands
{
    public class IntelXDKPlayer : BaseCommand
    {
        #region Private Members
        private bool playingStation = false;
        private bool playingPodcast = false;
        private bool playingAudio = false;

        private Dictionary<string, SoundEffectInstance> soundPool = new Dictionary<string, SoundEffectInstance>();
        //protected SoundPool soundPool;
        private Dictionary<string, int> soundPoolMapName2Id = new Dictionary<string, int>();
        private Dictionary<int, string> soundPoolMapId2Name = new Dictionary<int, string>();
        private Dictionary<string, bool> soundPoolShouldPlay = new Dictionary<string, bool>();

        private int watchTimer = -1;

        private int audioVolume = 1;

        private string soundName = "";

        private SoundEffectInstance mediaPlayer;              // Used to play back audio
        #endregion

        #region Constructor
        /// <summary>
        /// IntelXDKPlayer Constructor
        /// </summary>
        public IntelXDKPlayer()
        {
        }
        #endregion

        #region appmobi.js Handlers
        public void loadSound(string parameters)
        {
            string[] args = WPCordovaClassLib.Cordova.JSON.JsonHelper.Deserialize<string[]>(parameters);

            string soundName = args[0];

            if (soundName != null)
            {

                //int id = (soundPoolMapName2Id.ContainsKey(soundName)) ? soundPoolMapName2Id[soundName] : -1;

                //if (id == -1)
                if (!soundPool.ContainsKey(soundName))
                {
                    //id = soundPool.Count;

                    //an id of 0 means unable to load the sound
                    //soundPoolMapName2Id.Add(soundName, id);
                    //soundPoolMapId2Name.Add(id, soundName);
                    //soundPoolShouldPlay.Add(soundName, false);

                    SoundEffectInstance tmpMediaPlayer = SoundEffect.FromStream(Application.GetResourceStream(new Uri("www/" + soundName, UriKind.Relative)).Stream).CreateInstance();
                    tmpMediaPlayer.IsLooped = false;

                    soundPool.Add(soundName, tmpMediaPlayer);

                }
            }
        }

        public void unloadSound(string parameters)
        {
            string[] args = WPCordovaClassLib.Cordova.JSON.JsonHelper.Deserialize<string[]>(parameters);

            string soundName = args[0];

            if (soundPool.ContainsKey(soundName))
            {
                soundPool.Remove(soundName);
            }
        }

        public void unloadAllSounds(string parameters)
        {
            foreach (var item in soundPool)
            {
                soundPool.Remove(item.Key);
            }
        }

        public void volume(string parameters)
        {
            string[] args = WPCordovaClassLib.Cordova.JSON.JsonHelper.Deserialize<string[]>(parameters);

            string soundName = args[0];

            if (soundPool.ContainsKey(soundName))
            {
                soundPool.Remove(soundName);
            }
        }

        public void startAudio(string parameters)
        {
            // Play the audio in a new thread so the UI can update.
            //Thread soundThread = new Thread(new ThreadStart(PlayAudio));
            // soundThread.Start();
            Deployment.Current.Dispatcher.BeginInvoke(() =>
            {
                PlayAudio(parameters);
            });

        }

        public void toggleAudio(string parameters)
        {
            Deployment.Current.Dispatcher.BeginInvoke(() =>
            {
                this.ToggleAudio();
            });
        }

        public void stopAudio(string parameters)
        {
            Deployment.Current.Dispatcher.BeginInvoke(() =>
            {
                this.StopAudio();
            });
        }

        public void startUpdatingAudioTime(string parameters)
        {
            string js = "var e = document.createEvent('Events'); e.initEvent('intel.xdk.player.podcast.error', true, true); e.success = false; e.message = 'Podcast not implemented for Windows 8.'; document.dispatchEvent(e);";
            InvokeCustomScript(new ScriptCallback("eval", new string[] { js }), true);

            //Deployment.Current.Dispatcher.BeginInvoke(() =>
            //{
            //    string[] args = WPCordovaClassLib.Cordova.JSON.JsonHelper.Deserialize<string[]>(parameters);
            //    var time = args[0];

            //    if (watchTimer != null) {
            //        //clearInterval(watchTimer);
            //    }

            //    Timer myTimer = new Timer(onTimer,this,0,1000);
            //    //me.watchTimer = setInterval(function () {

            //    //}, time);
            //});
        }

        private void onTimer(object state)
        {
            var current = 0.0;
            var length = 0.0;

            try
            {
                //if( mediaPlayer != null && IsPlaying()) {           
                //    current = mediaPlayer.currentTime / 1000.0;
                //    length = mediaPlayer.duration / 1000.0;
                //}
            }
            catch (Exception ex) { }

            string js = "intel.xdk.player.audioInfo = {currentTime:" + current + ", duration:" + length + "};";
            InvokeCustomScript(new ScriptCallback("eval", new string[] { js }), true);
        }

        public void stopUpdatingAudioTime(string parameters)
        {
            //Deployment.Current.Dispatcher.BeginInvoke(() =>
            //{
            //});

            string js = "var e = document.createEvent('Events'); e.initEvent('intel.xdk.player.podcast.error', true, true); e.success = false; e.message = 'Podcast not implemented for Windows 8.'; document.dispatchEvent(e);";
            InvokeCustomScript(new ScriptCallback("eval", new string[] { js }), true);
        }

        public void setAudioVolume(string parameters)
        {
            Deployment.Current.Dispatcher.BeginInvoke(() =>
            {
                string[] args = WPCordovaClassLib.Cordova.JSON.JsonHelper.Deserialize<string[]>(parameters);

                if (mediaPlayer != null)
                {
                    float volume = -10;
                    float.TryParse(args[0], out volume);

                    volume = Math.Max(0.0f, volume);
                    volume = Math.Min(1.0f, volume);
                    mediaPlayer.Volume = volume;
                }
                StringBuilder js = new StringBuilder("var ev = document.createEvent('Events');ev.initEvent('intel.xdk.player.audio.volume.set',true,true);e.success=");
                js.Append((mediaPlayer == null) ? "false" : "true");
                js.Append("document.dispatchEvent(ev);");
                InvokeCustomScript(new ScriptCallback("eval", new string[] { js.ToString() }), true);
            });
        }

        public void playSound(string parameters)
        {
            Deployment.Current.Dispatcher.BeginInvoke(() =>
            {
                PlaySound(parameters);
            });
        }

        public void playPodcast(string parameters)
        {
            string[] args = WPCordovaClassLib.Cordova.JSON.JsonHelper.Deserialize<string[]>(parameters);

            string js = "";

            if (IsPlayingStation() || IsPlayingPodcast() || IsPlaying())
            {
                js = ("var ev = document.createEvent('Events');ev.initEvent('appMobi.player.podcast.busy');document.dispatchEvent(ev);");
                InvokeCustomScript(new ScriptCallback("eval", new string[] { js }), true);

                return;
            }

            if (parameters.Length < 1)
            {
                js = (string.Format("var ev = document.createEvent('Events');" +
                        "ev.initEvent('appMobi.cache.picture.add',true,true);ev.success=false;" +
                        "ev.filename='{0}';ev.message='{1}';document.dispatchEvent(ev);", "", "Wrong number of parameters"));
                InvokeCustomScript(new ScriptCallback("eval", new string[] { js }), true);
                return;
            }
            string strPodcastURL = HttpUtility.UrlDecode(args[0]);

            string fixedPodcastURL = "";

            if (strPodcastURL.StartsWith("http://") == false)
            {
                //try to find on local system
                /*File podcast = new File(Activity.appDir(), strPodcastURL);
                if (podcast.exists())
                {
                    //rewrite url to use localhost
                    //switch to Webview.rootDir instead of building manually
                    StringBuilder rewrittenURL = new StringBuilder("http://localhost:58888/");
                    rewrittenURL.Append(Webview.appConfigData.appName);
                    rewrittenURL.Append('/');
                    rewrittenURL.Append(Webview.appConfigData.releaseName);
                    if (strPodcastURL.charAt(0) != '/') rewrittenURL.Append('/');
                    rewrittenURL.Append(strPodcastURL);

                    fixedPodcastURL = rewrittenURL.ToString();
                }*/
            }
            else
            {
                fixedPodcastURL = strPodcastURL;
            }

            if (fixedPodcastURL == null)
            {
                js = ("var ev = document.createEvent('Events');ev.initEvent('appMobi.player.podcast.error',true,true);document.dispatchEvent(ev);");
                InvokeCustomScript(new ScriptCallback("eval", new string[] { js }), true);
                return;
            }

            MediaPlayerLauncher mediaPlayerLauncher = new MediaPlayerLauncher();

            mediaPlayerLauncher.Media = new Uri(fixedPodcastURL, UriKind.RelativeOrAbsolute);
            mediaPlayerLauncher.Location = MediaLocationType.Install;

            mediaPlayerLauncher.Controls = MediaPlaybackControls.All;
            mediaPlayerLauncher.Orientation = MediaPlayerOrientation.Landscape;
            mediaPlayerLauncher.Show();

            /*            BackgroundAudioPlayer.Instance
                        MediaStreamer mediaStreamer = MediaStreamerFactory.CreateMediaStreamer(123);
                        MediaStreamSource mss = new MediaStreamSource();*/


            //mss.SetVideoStream(sourceRGBA, 320, 240, "RGBA", 30 * TimeSpan.TicksPerSecond, false);
            //ms.SetSource(mss);

            // commented this out becasue shelling podcast out to native.  don't know when it is stopped.
            //isPlayingPodcast = true;
            js = ("javascript:var ev = document.createEvent('Events');ev.initEvent('appMobi.player.podcast.start',true,true);document.dispatchEvent(ev);");
            InvokeCustomScript(new ScriptCallback("eval", new string[] { js }), true);
        }
        #endregion

        #region Private Methods
        private void PlaySound(string parameters)
        {
            string[] args = WPCordovaClassLib.Cordova.JSON.JsonHelper.Deserialize<string[]>(parameters);

            soundName = args[0];

            try
            {
                if (!soundPool.ContainsKey(soundName))
                {
                    SoundEffectInstance tmpMediaPlayer = SoundEffect.FromStream(Application.GetResourceStream(new Uri("www/" + soundName, UriKind.Relative)).Stream).CreateInstance();
                    tmpMediaPlayer.IsLooped = false;
                    //soundPool.Add(soundName, sound);
                    tmpMediaPlayer.Play();

                    playingAudio = true;
                    string js = "var ev = document.createEvent('Events'); ev.initEvent('intel.xdk.player.audio.start'); document.dispatchEvent(ev);";
                    InvokeCustomScript(new ScriptCallback("eval", new string[] { js }), true);

                    soundPool.Add(soundName, tmpMediaPlayer);
                }
                else
                {
                    ((SoundEffectInstance)soundPool[soundName]).Play();
                }
            }
            catch (Exception e)
            {
                string js = "var ev = document.createEvent('Events'); ev.initEvent('intel.xdk.player.audio.error',true,true); document.dispatchEvent(ev);";
                InvokeCustomScript(new ScriptCallback("eval", new string[] { js }), true);
            }
        }

        private void PlayAudio(string parameters)
        {
            if (IsPlayingPodcast())
            {
                string js = "var ev = document.createEvent('Events'); ev.initEvent('intel.xdk.player.audio.busy', true, true); document.dispatchEvent(ev);";
                InvokeCustomScript(new ScriptCallback("eval", new string[] { js }), true);
                return;
            }
            else if (this.IsPlaying())
            {
                StopAudio();
            }

            string[] args = WPCordovaClassLib.Cordova.JSON.JsonHelper.Deserialize<string[]>(parameters);

            //URL.createObjectURL
            soundName = args[0];
            //int id = (soundPoolMapName2Id.ContainsKey(soundName)) ? soundPoolMapName2Id[soundName] : -1;

            try
            {
                //mediaPlayer.addEventListener('ended', function (e) {
                //    mediaPlayer.pause();
                //    mediaPlayer = null;
                //    this.playingAudio = false;
                //    this.busy = false;
                //}, false);

                //mediaPlayer.currentTime = 3;

                mediaPlayer = SoundEffect.FromStream(Application.GetResourceStream(new Uri("www/" + soundName, UriKind.Relative)).Stream).CreateInstance();
                mediaPlayer.IsLooped = false;
                mediaPlayer.Play();

                string js = "var ev = document.createEvent('Events'); ev.initEvent('intel.xdk.player.audio.start'); document.dispatchEvent(ev);";
                InvokeCustomScript(new ScriptCallback("eval", new string[] { js }), true);

            }
            catch (Exception e)
            {
                string js = "var ev = document.createEvent('Events'); ev.initEvent('intel.xdk.player.audio.error',true,true); document.dispatchEvent(ev);";
                InvokeCustomScript(new ScriptCallback("eval", new string[] { js }), true);
            }
        }

        private void ToggleAudio()
        {
            if (mediaPlayer != null)
            {
                if (IsPlaying())
                {
                    //me.audioTime = me.mediaPlayer.getCurrentPosition();
                    mediaPlayer.Pause();
                }
                else
                {
                    //me.mediaPlayer.seekTo(me.audioTime);
                    mediaPlayer.Play();
                }

                playingAudio = !playingAudio;
            }
        }

        private void StopAudio()
        {
            if (mediaPlayer != null)
            {
                try
                {
                    mediaPlayer.Pause();
                    mediaPlayer = null;

                    string js = "var ev = document.createEvent('Events'); ev.initEvent('intel.xdk.player.audio.stop',true,true); document.dispatchEvent(ev);";
                    InvokeCustomScript(new ScriptCallback("eval", new string[] { js }), true);

                }
                catch (Exception e)
                {
                    //e.printStackTrace();
                }
            }

            playingAudio = false;
        }

        private bool IsPlaying()
        {
            return playingAudio;
        }

        private bool IsPlayingPodcast()
        {
            return playingPodcast;
        }

        private bool IsPlayingStation()
        {
            return playingStation;
        }
        #endregion
    }
}
