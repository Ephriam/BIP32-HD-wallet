import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms'; 
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { MaterialModule } from './/material.module';
import {HttpClientModule} from '@angular/common/http';

import { HomeComponent } from './home/home.component';
import { LandComponent } from './land/land.component';
import { AppRoutingModule } from './/app-routing.module';
import { RegisterComponent } from './register/register.component';

import { LandService } from './land.service';
import { MainComponent } from './main/main.component';
import { WalletService } from './wallet.service';
import { ModalComponent } from './modal/modal.component';
import { HighlightDirective } from './highlight.directive';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LandComponent,
    RegisterComponent,
    MainComponent,
    ModalComponent,
    HighlightDirective
  ],
  imports: [
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule.forRoot()
  ],
  entryComponents: [
    RegisterComponent
  ],
  providers: [LandService, WalletService],
  bootstrap: [AppComponent]
})

export class AppModule { }
