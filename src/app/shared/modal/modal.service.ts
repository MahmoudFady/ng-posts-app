import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private isOpen$ = new Subject<boolean>();
  private modalResualt$ = new Subject<boolean>();
  setModalResualt(resualt: boolean) {
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
