import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimatedAlert } from './animated-alert';

describe('AnimatedAlert', () => {
  let component: AnimatedAlert;
  let fixture: ComponentFixture<AnimatedAlert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimatedAlert]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimatedAlert);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
