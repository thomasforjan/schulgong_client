import {Component, OnInit} from '@angular/core';
import {HeroImages} from "../../services/store.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Configuration} from "../../models/Configuration";
import {MatSliderDragEvent} from "@angular/material/slider";

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
  passwordForm!: FormGroup;
  configuration: Configuration = {
    password: "1234",
    ringtimeVolume: 20,
    alarmVolume: 50,
    announcementVolume: 70,
    ringtimeDirectory: "C:/Desktop/ringtimes/asdfasdfasdfasdfasdfasdfasdfasdfsadfasdfasdfasdfasdfasdf",
    playlistDirectory: "C:/Desktop/playlist",
  };
  musicForm!: FormGroup;

  ngOnInit(): void {
    this.passwordForm = new FormGroup(
      {
        currentPassword: new FormControl('', Validators.required),
        newPassword: new FormControl('', Validators.required),
        confirmPassword: new FormControl('', Validators.required),
      },
    );
    this.musicForm = new FormGroup(
      {
        ringtimeDirectory: new FormControl(this.configuration.ringtimeDirectory, Validators.required),
        playlistDirectory: new FormControl(this.configuration.playlistDirectory, Validators.required),
      },
    );
  }

  onSubmitClick() {

  }


  onRingtimeVolumeChange($event: MatSliderDragEvent) {

  }

  onAnnouncementVolumeChange($event: MatSliderDragEvent) {

  }

  onAlarmVolumeChange($event: MatSliderDragEvent) {

  }
}
