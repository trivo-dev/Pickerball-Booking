import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourtDetail } from './court-detail';

describe('CourtDetail', () => {
  let component: CourtDetail;
  let fixture: ComponentFixture<CourtDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourtDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourtDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
