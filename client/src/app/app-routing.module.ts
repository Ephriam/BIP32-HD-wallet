import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LandComponent } from './land/land.component';
import { MainComponent } from './main/main.component';

const routes : Routes = [
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: '',
    component: LandComponent
  },
  {
    path: 'home',
    component: MainComponent
  },
  {
    path: 'main',
    component: HomeComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }
