import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourtManagement } from './court-management';

describe('CourtManagement', () => {
  let component: CourtManagement;
  let fixture: ComponentFixture<CourtManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourtManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourtManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
