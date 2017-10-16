import { Component } from '@angular/core';
import { SankeyDataService } from './sankey-data.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  readonly data:Observable<any>;
  constructor(private _sankeyService:SankeyDataService){
    this.data = _sankeyService.getData();
  }  
}
