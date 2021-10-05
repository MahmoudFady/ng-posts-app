import { AngularMaterialModule } from './../angular-material.module';
import { ModalComponent } from './modal/modal.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [ModalComponent],
  imports: [CommonModule, AngularMaterialModule],
  exports: [CommonModule, AngularMaterialModule, ModalComponent],
})
export class SharedModule {}
