import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private isOpen$ = new Subject<boolean>();
  private modalResualt$ = new Subject<boolean>();
  setModalResualt(resualt: boolean) {
    console.log('set modal resualt..');

    this.modalResualt$.next(resualt);
    this.isOpen$.next(false);
  }
  open() {
    this.isOpen$.next(true);
  }
  isOpen() {
    return this.isOpen$.asObservable();
  }
  getModalResualt() {
    return this.modalResualt$.asObservable();
  }
}
