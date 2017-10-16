import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SankeyDataService {

  constructor(private _http: HttpClient) { }

  getData() : Observable<Object>{
    return this._http.get("assets/data/data.json");
  }

}
