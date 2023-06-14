import { Component, OnInit } from '@angular/core';
import {
  ButtonHeight,
  ButtonValue,
  ButtonWidths,
  HeroImages,
  StoreService,
} from '../../services/store.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSliderDragEvent } from '@angular/material/slider';
import { map } from 'rxjs';
import { SettingsBackendService } from '../../services/settings.backend.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  /**
   * @description Flag which indicates if the application is currently loading
   */
  public loadingSpinner = false;

  /**
   * @description Error message which is displayed if password update failed
   */
  public updatePasswordFormErrorMessage: string | null = null;

  /**
   * @description Success message which is displayed if password update was successful
   */
  public updatePasswordFormSuccessMessage: string | null = null;

  /**
   * @description Flag which indicates if the form error messages should be visible
   */
  public isFormErrorMessagesVisible = false;

  /**
   * Live Hero Image from enum in store service
   */
  settingsHeroImage: string = HeroImages.SettingsHeroImage;

  protected readonly ButtonValue = ButtonValue;
  protected readonly ButtonWidths = ButtonWidths;
  protected readonly ButtonHeight = ButtonHeight;

  /**
   * Form group for the password
   */
  passwordForm!: FormGroup;

  volumeRingtime$ = this.storeService.configuration$.pipe(
    map((configuration) => {
      if (configuration) {
        return configuration.ringtimeVolume;
      } else {
        return 0;
      }
    })
  );

  volumeAlarm$ = this.storeService.configuration$.pipe(
    map((configuration) => {
      if (configuration) {
        return configuration.alarmVolume;
      } else {
        return 0;
      }
    })
  );

  volumeAnnouncement$ = this.storeService.configuration$.pipe(
    map((configuration) => {
      if (configuration) {
        return configuration.announcementVolume;
      } else {
        return 0;
      }
    })
  );

  ringtonesDirectory$ = this.storeService.configuration$.pipe(
    map((configuration) => {
      if (configuration) {
        return configuration.ringtimeDirectory;
      } else {
        return '';
      }
    })
  );

  playlistDirectory$ = this.storeService.configuration$.pipe(
    map((configuration) => {
      if (configuration) {
        return configuration.playlistDirectory;
      } else {
        return '';
      }
    })
  );

  constructor(
    public storeService: StoreService,
    private _settingsBackendService: SettingsBackendService
  ) {}

  ngOnInit(): void {
    this._settingsBackendService
      .getConfiguration()
      .subscribe((configuration) => {
        this.storeService.updateConfiguration(configuration);
      });

    this.passwordForm = new FormGroup({
      currentPassword: new FormControl('', Validators.required),
      newPassword: new FormControl('', Validators.required),
      confirmNewPassword: new FormControl('', Validators.required),
    });
  }

  /**
   * Method for saving the new password
   */
  onSubmitClick() {
    this.updatePasswordFormErrorMessage = '';
    this.updatePasswordFormSuccessMessage = '';
    this.loadingSpinner = true;

    if (this.passwordForm.valid) {
      const currentPasswordControl = this.passwordForm.get('currentPassword');
      const newPasswordControl = this.passwordForm.get('newPassword');
      const confirmPasswordControl =
        this.passwordForm.get('confirmNewPassword');

      if (
        currentPasswordControl &&
        newPasswordControl &&
        confirmPasswordControl
      ) {
        const currentPassword = currentPasswordControl.value;
        const newPassword = newPasswordControl.value;
        const confirmPassword = confirmPasswordControl.value;

        if (newPassword === confirmPassword) {
          this._settingsBackendService
            .postNewPassword(currentPassword, newPassword, confirmPassword)
            .subscribe({
              next: (data: any) => {
                this.loadingSpinner = false;
                this.updatePasswordFormErrorMessage = null;
                this.updatePasswordFormSuccessMessage = data;
              },
              error: (error: HttpErrorResponse) => {
                this.loadingSpinner = false;
                this.isFormErrorMessagesVisible = true;
                this.updatePasswordFormErrorMessage = error.error;
              },
            });
        } else {
          this.loadingSpinner = false;
          this.isFormErrorMessagesVisible = true;
          this.updatePasswordFormErrorMessage =
            'Passwörter stimmen nicht überein!';
        }
      }
    } else {
      this.isFormErrorMessagesVisible = false;
      this.updatePasswordFormErrorMessage = null;
      this.loadingSpinner = false;
    }
  }

  /**
   * Method for saving the ringtime volume
   */
  onRingtimeVolumeChange(event: MatSliderDragEvent) {
    this._settingsBackendService.postRingtimeVolume(event.value);
  }

  /**
   * Method for saving the announcement volume
   */
  onAnnouncementVolumeChange(event: MatSliderDragEvent) {
    this._settingsBackendService.postAnnouncementVolume(event.value);
  }

  /**
   * Method for saving the alarm volume
   */
  onAlarmVolumeChange(event: MatSliderDragEvent) {
    this._settingsBackendService.postAlarmVolume(event.value);
  }
}
