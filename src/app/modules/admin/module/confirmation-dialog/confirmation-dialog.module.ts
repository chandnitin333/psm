import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogComponent } from '../../components/confirmation-dialog/confirmation-dialog.component';


@NgModule({
  declarations: [ConfirmationDialogComponent],
  imports: [CommonModule],
  exports: [ConfirmationDialogComponent] // Ensure it is exported
})
export class ConfirmationDialogModule { }