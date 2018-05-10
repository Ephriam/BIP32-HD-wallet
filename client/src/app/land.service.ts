import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from "@angular/common/http";
@Injectable()
export class LandService {

  constructor(private _http: HttpClient) { }

  baseUrl = 'http://localhost:3000/';
  token;
  logedInUser;
  signUp(user){
    var headers = new HttpHeaders();
    return this._http.post(this.baseUrl + 'register', user, {headers: headers});
  }

  signIn(user){
    var headers = new HttpHeaders();
    return this._http.post(this.baseUrl + 'login', user, {headers: headers});
  }

  getUser(token){
    var headers = new HttpHeaders().set('authorization', 'Bearer ' + token);
    return this._http.get(this.baseUrl + 'main/get_user', {headers: headers});
  }

  setToken(token){
    this.token = token;
    return;
  }

  getToken(){
    return this.token;
  }

  setUser(user){
    console.log("land Service"+user);
    this.logedInUser = user;
    return;
  }

  getLoggedInUser(){
    return this.logedInUser;
  }

}
