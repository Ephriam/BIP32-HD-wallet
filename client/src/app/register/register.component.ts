import { Component, OnInit, Inject } from '@angular/core';
import { LandService } from '../land.service';
import { Router } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
 
  user = {};
  token;
  logedInUser;
  disabled = false;

  constructor(private landService: LandService, private router: Router,
    public dialogRef: MatDialogRef<RegisterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  tabChange(e){
    this.user = {};
  }



  onChange() {
    this.logedInUser = this.user;
    if(this.logedInUser.password == this.logedInUser.confirm_password){
      this.disabled = false
    }else{this.disabled = true}
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  signUp() {
    this.landService.signUp(this.user).subscribe(
      (data) => {
        console.log(data);
      });
  }

  signIn() {
    this.landService.signIn(this.user).subscribe(
      (data) => {
        this.token = data;
        if(this.token.err == null){
        this.token = this.token.token;
        this.landService.setToken(this.token);
        this.landService.getUser(this.token).subscribe(
          (data) => {
            this.user = {};
            this.logedInUser = data;
            if(this.logedInUser.err == null){
              this.landService.setUser(this.logedInUser.msg);
              console.log(this.logedInUser.msg)
              this.dialogRef.close();
              this.router.navigate(['home']);
            }else{console.log(this.logedInUser.err)}
          }
        )
        }else{console.log('invalid crediantials');}
      });

  }
}
