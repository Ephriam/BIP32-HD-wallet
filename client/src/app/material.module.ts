import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatDialogModule, MatButtonModule, MatCheckboxModule, 
        MatToolbarModule, MatInputModule, MatProgressBarModule,
        MatCardModule, MatProgressSpinnerModule, MatTabsModule, 
        MatIconModule, MatMenuModule, MatSidenavModule} from '@angular/material'; 

@NgModule({
  imports: [
    CommonModule, MatCheckboxModule, MatDialogModule, 
    MatButtonModule, MatToolbarModule, MatInputModule, 
    MatProgressBarModule, MatCardModule, MatProgressSpinnerModule,
    MatTabsModule, MatIconModule, MatMenuModule, MatSidenavModule
  ],
  exports: [
    CommonModule, MatButtonModule, MatCheckboxModule, MatDialogModule,
    MatToolbarModule, MatInputModule, MatProgressBarModule, MatCardModule,
    MatProgressSpinnerModule, MatTabsModule, MatIconModule, MatMenuModule, MatSidenavModule
  ],
  declarations: []
})
export class MaterialModule { }
