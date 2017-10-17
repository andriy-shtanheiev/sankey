import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import * as d3Sankey from 'd3-sankey';

@Injectable()
export class SankeyDataService {

  constructor(private _http: HttpClient) { }

  getData() : Observable<d3Sankey.SankeyGraph<d3Sankey.SankeyExtraProperties, d3Sankey.SankeyExtraProperties>>{
    return this._http.get<d3Sankey.SankeyGraph<d3Sankey.SankeyExtraProperties, d3Sankey.SankeyExtraProperties>>("assets/data/data.json");
  }
}
