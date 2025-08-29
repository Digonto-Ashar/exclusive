import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonProductDetails } from './skeleton-product-details';

describe('SkeletonProductDetails', () => {
  let component: SkeletonProductDetails;
  let fixture: ComponentFixture<SkeletonProductDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonProductDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkeletonProductDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
