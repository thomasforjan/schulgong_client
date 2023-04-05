import {Component, OnInit} from '@angular/core';
import {StoreService} from "./store.service";
import {BackendService} from "./backend.service";

/**
 * @author Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version 0.1
 * @implNote practical project
 * @since March 2023
 */
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit{



  async ngOnInit() {
    await this.backendService.getTest();
    console.log(this.storeService.test)

  }

  constructor(public storeService: StoreService, private backendService: BackendService) {
  }



}
