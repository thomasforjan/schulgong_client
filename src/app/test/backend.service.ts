import {Injectable} from "@angular/core";
import {StoreService} from "./store.service";
import {HttpClient} from "@angular/common/http";
import {firstValueFrom} from "rxjs";

/**
 * @author Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version 0.1
 * @implNote practical project
 * @since March 2023
 */
@Injectable({
  providedIn: 'root'
})
export class BackendService {
  test: any[] = [];

  constructor(private storeService: StoreService, private http: HttpClient) {
  }

  /**
   * Method for READ operation to get data from backend
   *
   */
  public async getTest() {
    const response = await firstValueFrom(this.http.get<any>('http://localhost:8080/tests'))
    const test = response._embedded.testList;
    this.test = test;
    this.storeService.test = test;
    console.log(test);
    console.log(response);
  }
}
