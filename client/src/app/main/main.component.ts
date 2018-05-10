import { Component, OnInit } from '@angular/core';
import { LandService } from '../land.service';
import { Router } from '@angular/router';
import { WalletService } from '../wallet.service';
import { HttpHeaders } from '@angular/common/http/src/headers';
import { trigger, state, style, animate, transition, query, stagger, keyframes } from '@angular/animations';

import 'jquery'
import 'jquery.qrcode'

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  animations: [
    trigger('firstAnimation', [
      transition('* => *', [
        query(':enter', style({opacity: 0}), {optional: true}),
        query(':enter', stagger('.3s', [
          animate('5s ease-in', keyframes([
            style({opacity:0, transform: 'translateY(-100px)', offset: 0}),
            style({opacity: 1, transform: 'translateY(0px)', offset: 1}),
          ]))]), {optional: true})
    ])
  ])
]
})
export class MainComponent implements OnInit {

  loggedInUser: any;
  tx = {};
  btcTx: any;
  balance: any;
  connection: any;
  currentTab: any;
  coins = ['BTCTEST', 'LTCTEST']
  testadd = '1quioukds03923kdfsa2d'
  constructor(private walletSevice: WalletService, private landService: LandService, private router: Router) { 
   
  }

  ngOnInit() {
    var $ = jQuery
    $(document).ready(() => {
      $('#qrcode1').qrcode(this.testadd)
    })
    this.loggedInUser = this.landService.getLoggedInUser();
    this.balance = {msg: 0};
    this.loggedInUser = true;
    if( this.loggedInUser != null){
      this.getBalance(this.coins[0]);
    }else{this.router.navigate(['register']);}
  }

  tabChange(e){
    this.currentTab = e.index
    this.getBalance(this.coins[this.currentTab])
    this.tx = {}
  }

  sendTransaction(){
    this.btcTx = this.tx;
    this.btcTx.coin = this.coins[this.currentTab];
    if(this.btcTx.to && this.btcTx.amount){ 
    this.walletSevice.sendTransaction(this.btcTx).subscribe(
      (data) => {
        console.log(data);
      });
    }else{console.log('fill in the blanks')}
  }

  getBalance(coin){
    this.walletSevice.getBalance(this.loggedInUser.testnetLitecoinAddress, coin).subscribe(
      (res) => {
        this.connection = res;
        if(this.connection.err == null){
          this.balance = res
          if(this.balance.msg == null){this.balance.msg = 0}
          this.balance.msg = this.balance.msg/100000000
          console.log(this.balance.msg);
        }else{console.log(this.connection.err)}
      });
  }

  logout() {
    this.landService.setToken('');
    this.router.navigate(['']);
  }

  shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));

}
