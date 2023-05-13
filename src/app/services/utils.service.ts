import {Injectable} from "@angular/core";
import {take} from "rxjs/operators";
import {Observable} from "rxjs";

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.2
 * @since: May 2023
 * @description: Service for some methods, which are used more than one time in any component.
 */
@Injectable({
  providedIn: 'root',
})
export class UtilsService {

  /**
   * Transform shown number into real id of object
   * @param index of object
   * @param list$ variable list to get the id of the right object
   * @returns real id of object
   */
  getRealObjectId(index: number, list$: Observable<any[]>): number {
    list$.pipe(take(1)).subscribe((list) => {
      index = list[index].id;
    });
    return index;
  }

}
