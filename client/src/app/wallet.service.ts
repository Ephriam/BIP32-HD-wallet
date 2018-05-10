import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LandService } from './land.service';

@Injectable()
export class WalletService {

  constructor(private _http: HttpClient, private landService: LandService) { }
  
  baseUrl= 'http://localhost:3000/';
  
  sendTransaction(tx){
    let headers = new HttpHeaders().set('authorization', 'Bearer ' + this.landService.getToken());
    console.log(tx);
    return this._http.post(this.baseUrl + 'main/send_transaction', {tx: tx}, {headers: headers})
  }

  getBalance(address, coin){
    let body = {coin: coin, address: address}
    let headers = new HttpHeaders().set('authorization', 'Bearer ' + this.landService.getToken());
    return this._http.post(this.baseUrl + 'main/get_balance', body, {headers: headers});
  }
}
