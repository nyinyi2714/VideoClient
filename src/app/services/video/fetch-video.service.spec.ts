import { TestBed } from '@angular/core/testing';

import { FetchVideoService } from './fetch-video.service';

describe('FetchVideoService', () => {
  let service: FetchVideoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchVideoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
