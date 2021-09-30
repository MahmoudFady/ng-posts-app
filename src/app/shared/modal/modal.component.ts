import { ModalService } from './modal.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.sass'],
})
export class ModalComponent implements OnInit {
  open = false;
  subscriptions: Subscription[] = [];
  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    this.subscriptions[this.subscriptions.length] = this.modalService
      .isOpen()
      .subscribe((isOpen) => {
        this.open = isOpen;
      });
  }
  close(resualt: boolean) {
    this.modalService.setModalResualt(resualt);
  }
  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
