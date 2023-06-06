import {Component, OnInit} from '@angular/core';
import {
  HeroImages,
  LiveIcons,
  LiveNames,
  RoutingLinks, StoreService,
} from 'src/app/services/store.service';
import {LiveBackendService} from "../../services/live.backend.service";
import * as RecordRTC from 'recordrtc';
import {Howl} from "howler";


/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.2
 * @since: May 2023
 * @description: Live component
 */
@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.scss'],
})
export class LiveComponent implements OnInit{

  /**
   * Live Hero Image from enum in store service
   */
  liveHeroImage: string = HeroImages.LiveHeroImage;

  /**
   * Live icons from enum in store service
   */
  liveIcons: string[] = Object.values(LiveIcons);

  /**
   * Live title from enum in store service
   */
  liveTitles: string[] = Object.values(LiveNames);

  /**
   * Helper variable to store original title
   */
  originalTitle: string = '';

  /**
   * Boolean to check if recording is in enabled state
   */
  isRecording: boolean = false;

  /**
   * Boolean to check if new recording is allowed
   */
  isNewRecordingAllowed: boolean = false;

  /**
   * Boolean to check if recording controls are visible
   */
  isRecordingControlsVisible: boolean = false;

  /**
   * Object for recording an announcement
   */
  recorder: RecordRTC | undefined;

  /**
   * Recording of the announcement
   */
  blob: Blob | undefined;

  /**
   * Url for howl to play the announcement
   */
  url: string | undefined;

  /**
   * Boolean to check if the user is playing a ringtone
   */
  playing: boolean[] = [];

  sound!: Howl;

  constructor(
    public storeService: StoreService,
    private _liveBackendService: LiveBackendService,
  ) {
  }

  /**
   * Lifecycle Hook which is called when the component is initialized
   */
  ngOnInit(): void {
    this._liveBackendService.getIsPlayingAlarm().subscribe((isPlayingAlarm: boolean) => {
      this.storeService.isAlarmEnabled = isPlayingAlarm;
    });
  }

  /**
   * Lifecycle Hook which is called when the component is destroyed
   */
  ngOnDestroy(): void {
    this.playing[0] = false;
    if (this.sound) {
      this.sound.stop();
      this.sound.unload();
    }
  }

  /**
   * @description This method toggles the recording status. If the passed index is 0 and
   * no new recording is currently allowed (isNewRecordingAllowed is false),
   * it toggles the isRecording status.
   * If recording starts, the method changes the first element of liveTitles
   * to 'Recording...' and hides the recording controls.
   * If recording ends, it resets the first element of liveTitles, sets
   * isRecording to false, isNewRecordingAllowed to true,
   * and makes the recording controls visible.
   *
   * @param index - The index of the recording
   */
  onRecordToggle(index: number) {
    if (index === 0 && !this.isNewRecordingAllowed) {
      this.isRecording = !this.isRecording;
      if (this.isRecording) {
        this.originalTitle = this.liveTitles[0];
        this.liveTitles[0] = 'Recording...';
        this.isRecordingControlsVisible = false; // set it to false when recording starts
        this.startRecording();
      } else {
        this.liveTitles[0] = this.originalTitle;
        this.isRecording = false; // set it to false when recording ends
        this.isNewRecordingAllowed = true;
        this.isRecordingControlsVisible = true; // set it to true when recording ends
        this.stopRecording();
      }
    }
  }

  /**
   * @description This method plays the recording. If the passed index is 0,
   * @param index - The index of the card
   */
  onPlay(index: number) {
    if (index === 0) {
      if(!this.playing[index]) {
        if(this.blob !== undefined) {
          this.url = URL.createObjectURL(this.blob);
          this.sound = new Howl({
            src: this.url,
            html5: true,
            format: "webm",
            onloaderror: (soundId, error) => {
              console.error('Howler Load Error:', error);
            },
          });
          this.sound.play()
          this.playing[index] = true;
          this.sound.once('end', () => {
            this.playing[index] = false;
          });
        }
      }else {
        this.sound.stop();
        this.playing[index] = false;
      }
    }
  }

  /**
   * @description This method sends the recording. If the passed index is 0,
   * @param index - The index of the card
   */
  onSend(index: number) {
    if (index === 0) {
      if(this.blob != undefined){
        this._liveBackendService.postLiveAnnouncement(this.blob);
      }
      this.resetRecordingState();
    }
  }

  /**
   * @description This method deletes the recording. If the passed index is 0,
   * @param index - The index of the recording
   */
  onDelete(index: number) {
    if (index === 0) {
      this.resetRecordingState();
    }
  }

  /**
   * @description This method resets the recording state.
   */
  resetRecordingState() {
    this.isNewRecordingAllowed = false;
    this.isRecordingControlsVisible = false;
    this.blob = undefined;
    this.url = undefined;
  }

  /**
   * @description If the passed index is 2 this method starts and stop the alarm
   * @param index - The index of the card
   */
  onAlarmToggle(index: number) {
    if (index === 2) {
      this.storeService.isAlarmEnabled = !this.storeService.isAlarmEnabled;
      this._liveBackendService.postIsPlayingAlarmRequest(this.storeService.isAlarmEnabled);
    }
  }

  /**
   * @description Start recording the announcement
   */
  startRecording() {
    if (this.recorder == undefined) {
      navigator.mediaDevices.getUserMedia({
        audio: true
      }).then(async (stream) => {
        this.recorder = new RecordRTC(stream, {
          type: 'audio'
        });
        this.recorder.startRecording();
      });
    }
  }

  /**
   * @description Stop recording the announcement
   */
  stopRecording() {
    if(this.recorder !== undefined) {
      this.recorder.stopRecording(() => {
        if (this.recorder != null && this.recorder != undefined) {
          this.blob = this.recorder.getBlob();
          this.recorder = undefined;
        }
      });
    }
  }

}
