import {Injectable} from '@angular/core';
import {AbstractControl, FormGroup, ValidationErrors} from '@angular/forms';

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.2
 * @since: May 2023
 * @description: Service for converting Date objects into formatted strings and vice versa. Also contains a validator for validating whether the end date is greater than or equal to the start date.
 */
@Injectable({
  providedIn: 'root',
})
export class DateUtilsService {

  /**
   * @description Converts a Date object into a formatted string.
   * @param date - The Date object to be converted
   * @param locales - The locale to be used for the conversion
   * @returns A formatted string of the Date object
   */
  convertDateTimeToString(date: Date, locales: string): string {
    return new Date(date).toLocaleDateString(locales, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  /**
   * @description Converts a formatted date string into a Date object.
   * @param date - The Date object, which will be converted into a formatted date string first.
   * @param locales - The locale to be used for the conversion
   * @returns A Date object created from the formatted date string.
   */
  convertStringToDateTime(date: Date, locales: string): Date {
    const dateString = date.toLocaleDateString(locales, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    return new Date(dateString);
  }

  /**
   * @description Validates whether the end date is greater than or equal to the start date.
   * @param control - The AbstractControl object containing the start and end dates to be validated.
   * @returns An object with an invalidDateRange property if the end date is before the start date; otherwise, null.
   */
  dateRangeValidator(control: AbstractControl): ValidationErrors | null {
    const startDate = control.get('startDate')?.value;
    const endDate = control.get('endDate')?.value;
    if (startDate && endDate) {
      const minEndDate = new Date(startDate);
      minEndDate.setDate(minEndDate.getDate());
      if (new Date(endDate) < minEndDate) {
        control.get('endDate')?.setErrors({ invalidDateRange: true });
        return { invalidDateRange: true };
      } else {
        control.get('endDate')?.setErrors(null);
      }
    }
    return null;
  }

  /**
   * @description Checks if a form has an invalid date range error.
   * @param form - The FormGroup object to be checked.
   * @returns A boolean indicating whether the form has an invalid date range error.
   */
  hasInvalidDateRangeError(form: FormGroup): boolean {
    return form?.hasError('invalidDateRange') || false;
  }

  createDatesToStringPeriod(startDate: Date, endDate: Date, locales: string){
    return `${this.convertDateTimeToString(startDate, locales)} - ${this.convertDateTimeToString(endDate, locales)}`;
  }
}
