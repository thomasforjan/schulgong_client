import {Component, OnInit} from '@angular/core';
import {HeroImages, MenuNames, RoutingLinks, StoreService} from "../../services/store.service";
import {BackendService} from "../../services/backend.service";
import {map, Observable, take, tap} from "rxjs";
import {Ringtone, RingtonePayload} from "../../models/Ringtone";


/**
 - author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 - version: 0.0.1
 - date: 12.04.2023
 - description: Dashboard component
 */
@Component({
  selector: 'app-ringtones',
  templateUrl: './ringtones.component.html',
  styleUrls: ['./ringtones.component.scss']
})
export class RingtonesComponent implements OnInit {


  /**
   * Menu titles from enum in store service
   */
  titles: string[] = Object.values(MenuNames);

  /**
   * Router links from enum in store service
   */
  routerLinks: string[] = Object.values(RoutingLinks);

  /**
   * Dashboard icons from enum in store service
   */
  ringtoneIcon: string[] = Object.values(HeroImages);


  formData = '';
  isEditing = false;
  editingRingtoneId: number | null = null;
  cardLength$ = this.storeService.ringtoneList$.pipe(
    map((list) => list.length));

  ngOnInit(): void {
    // this.showResponse();
  }


  constructor(public storeService: StoreService, private backendService: BackendService) {
  }

  //
  // /**
  //  * Get the size of the ringtone
  //  * @returns
  //  */
  // getRingToneId(): Observable<number[]> {
  //   return this.storeService.ringtoneList$.pipe(
  //     map((ringtoneList) => ringtoneList.map((ringtone) => ringtone.id))
  //   );
  // }
  //
  // getRingToneName(): Observable<string[]> {
  //   return this.storeService.ringtoneList$.pipe(
  //     map((ringtoneList) => ringtoneList.map((ringtone) => ringtone.name))
  //   );
  // }
  //
  // getRingToneFilename(): Observable<string[]> {
  //   return this.storeService.ringtoneList$.pipe(
  //     map((ringtoneList) => ringtoneList.map((ringtone) => ringtone.filename))
  //   );
  // }
  //
  // getRingToneDate(): Observable<string[]> {
  //   return this.storeService.ringtoneList$.pipe(
  //     map((ringtoneList) => ringtoneList.map((ringtone) => ringtone.date))
  //   );
  // }
  //
  // getRingToneSize(): Observable<string[]> {
  //   return this.storeService.ringtoneList$.pipe(
  //     map((ringtoneList) => ringtoneList.map((ringtone) => ringtone.size + ' MB'))
  //   );
  // }
  //
  // /**
  //  * Method which is called when the edit button is clicked
  //  * @param index index of the ringtone
  //  */
  // onEditRingtone(index: number) {
  //   this.storeService.ringtoneList$.pipe(
  //     take(1)).subscribe((ringToneList) => {
  //       index = ringToneList[index].id;
  //     console.log(index)
  //   })
    /*let test = this.storeService.ringtoneList$.pipe(
      map((ringtoneList) => ringtoneList[index - 1].id)
    );
    console.log(test)
    return test*/
  // }

  /*
    /!**
     * Method which is called when the play button is clicked
     * @param index index of the ringtone
     *!/
    onPlayRingtone(index: number) {
      const ringtone = this.getRingtone(index);
      console.log('Play ringtone:', ringtone);
    }

    /!**
     * Method which is called when the delete button is clicked
     * @param index index of the ringtone
     *!/
    onDeleteRingtone(index: number) {
      const ringtone = this.getRingtone(index);
      console.log('Delete ringtone:', ringtone);
    }*/

  // Response
  // showResponse() {
  //   this.backendService
  //     .getRingtoneResponse()
  //     .pipe(
  //       tap((response) => {
  //         if (
  //           response.body &&
  //           response.body._embedded &&
  //           response.body._embedded.ringToneDTOList
  //
  //         ) {
  //           const ringtoneList = response.body._embedded.ringToneDTOList;
  //           this.storeService.updateRingtoneList(ringtoneList);
  //         }
  //       })
  //     )
  //     .subscribe();
  // }

  /* // Post and Update
   submitData(){
     if (this.isEditing){
       this.updateData()
     } else {
       const formData: RingtonePayload = {};
       this.backendService.postRingtoneRequest(formData).subscribe((response)=>{
         const newRingtone = response.body;
         if (newRingtone){
           this.storeService.ringtoneList$
             .pipe(take(1))
             .subscribe((currentRingtoneList) => {
               const updatedList = [...currentRingtoneList, newRingtone];
               this.storeService.updateRingtoneList(updatedList);
               this.formData = '';
             });
         }
       });
     }
   }

   // load data into modal window
   loadCurrentRingtone(id: number): void{
     this.isEditing = true;
     this.editingRingtoneId = id;
     this.storeService.ringtoneList$
       .pipe(take(1))
       .subscribe((ringtoneList) => {
         const ringtoneToEdit = ringtoneList.find((ringtone) => ringtone.id === id);
         if (ringtoneToEdit){
           this.formData = ringtoneToEdit.info;
         }
       });
   }

   // Update
   updateData(): void{
     if (this.editingRingtoneId !== null){
       const updateRingtone: Ringtone = {
         id: this.editingRingtoneId,
         name: this.formData,
         filename: this.formData,
         path: this.formData,
         date: this.formData,
         //TODO was machen sachen?
         size: +this.formData
       };
       this.backendService
         .updateRingtoneResource(updateRingtone)
         .subscribe((response) => {
           const updatedRingtone = response.body;
           if (updatedRingtone){
             this.storeService.ringtoneList$
               .pipe(take(1))
               .subscribe((currentRingtoneList) =>{
                 const updatedList = currentRingtoneList.map((ringtone) =>
                   ringtone.id === updatedRingtone.id ? updatedRingtone : ringtone
                 );
                 this.storeService.updateRingtoneList(updatedList);
                 this.formData = '';
                 this.isEditing = false;
                 this.editingRingtoneId = null;
               });
           }
         });
     }
   }*/

  // // Delete
  // onDeleteRingtone(index: number): void {
  //   this.storeService.ringtoneList$.pipe(
  //     take(1)).subscribe((ringToneList) => {
  //     index = ringToneList[index].id;
  //     console.log(index)
  //   })
  //   this.backendService.deleteRingtoneResource(index)
  //     .subscribe(() => {
  //       this.storeService.ringtoneList$.pipe(take(1)).subscribe((ringtoneList) => {
  //         const updatedRingtoneList = ringtoneList.filter((ringtone) => ringtone.id !== index);
  //         this.storeService.updateRingtoneList(updatedRingtoneList);
  //       });
  //     });
  // }
}
