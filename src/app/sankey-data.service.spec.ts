import { TestBed, inject } from '@angular/core/testing';

import { SankeyDataService } from './sankey-data.service';

describe('SankeyDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SankeyDataService]
    });
  });

  it('should be created', inject([SankeyDataService], (service: SankeyDataService) => {
    expect(service).toBeTruthy();
  }));
});
