import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourtList } from './court-list';

describe('CourtList', () => {
  let component: CourtList;
  let fixture: ComponentFixture<CourtList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourtList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourtList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
