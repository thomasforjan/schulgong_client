import {Component, OnInit} from '@angular/core';
import {HeroImages, StoreService} from "../../services/store.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Configuration} from "../../models/Configuration";
import {MatSliderDragEvent} from "@angular/material/slider";
import {map} from "rxjs";
import {SettingsBackendService} from "../../services/settings.backend.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  /**
   * Live Hero Image from enum in store service
   */
  settingsHeroImage: string = HeroImages.SettingsHeroImage;
  /**
   * Form group for the password
   */
  passwordForm!: FormGroup;
  configuration: Configuration = {
    password: "1234",
    ringtimeVolume: 20,
    alarmVolume: 50,
    announcementVolume: 70,
    ringtimeDirectory: "C:/Desktop/ringtimes",
    playlistDirectory: "C:/Desktop/playlist",
  };

  volumeRingtime$ = this.storeService.configuration$.pipe(map((configuration) => {
    if(configuration) {
      return configuration.ringtimeVolume;
    }else {
      return 0;
    }
  }));

  volumeAlarm$ = this.storeService.configuration$.pipe(map((configuration) => {
    if(configuration) {
      return configuration.alarmVolume;
    }else {
      return 0;
    }
  }));

  volumeAnnouncement$ = this.storeService.configuration$.pipe(map((configuration) => {
    if(configuration) {
      return configuration.announcementVolume;
    }else {
      return 0;
    }
  }));

  ringtonesDirectory$ = this.storeService.configuration$.pipe(map((configuration) => {
    if(configuration) {
      return configuration.ringtimeDirectory;
    }else {
      return "";
    }
  }));

  playlistDirectory$ = this.storeService.configuration$.pipe(map((configuration) => {
    if(configuration) {
      return configuration.playlistDirectory;
    }else {
      return "";
    }
  }));


  constructor(
    public storeService: StoreService,
    private _settingsBackendService: SettingsBackendService,
  ) {
  }

  ngOnInit(): void {
    this._settingsBackendService.getConfiguration().subscribe((configuration) => {
      this.storeService.updateConfiguration(configuration);
    });

    this.passwordForm = new FormGroup(
      {
        currentPassword: new FormControl('', Validators.required),
        newPassword: new FormControl('', Validators.required),
        confirmPassword: new FormControl('', Validators.required),
      },
    );
  }

  /**
   * Method for saving the new password
   */
  onSubmitClick() {

  }

  /**
   * Method for saving the ringtime volume
   */
  onRingtimeVolumeChange(event: MatSliderDragEvent) {
    this._settingsBackendService.postRingtimeVolume(event.value)
  }

  /**
   * Method for saving the announcement volume
   */
  onAnnouncementVolumeChange(event: MatSliderDragEvent) {
    this._settingsBackendService.postAnnouncementVolume(event.value)
  }

  /**
   * Method for saving the alarm volume
   */
  onAlarmVolumeChange(event: MatSliderDragEvent) {
    this._settingsBackendService.postAlarmVolume(event.value)
  }
}
