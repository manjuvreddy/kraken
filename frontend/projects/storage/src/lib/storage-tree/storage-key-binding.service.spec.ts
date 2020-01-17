import { TestBed } from '@angular/core/testing';

import { StorageKeyBindingService } from './storage-key-binding.service';

describe('StorageKeyBindingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StorageKeyBindingService = TestBed.get(StorageKeyBindingService);
    expect(service).toBeTruthy();
  });
});
