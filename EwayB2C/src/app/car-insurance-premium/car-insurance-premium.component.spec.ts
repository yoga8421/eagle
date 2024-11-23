import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarInsurancePremiumComponent } from './car-insurance-premium.component';

describe('CarInsurancePremiumComponent', () => {
  let component: CarInsurancePremiumComponent;
  let fixture: ComponentFixture<CarInsurancePremiumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CarInsurancePremiumComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarInsurancePremiumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
