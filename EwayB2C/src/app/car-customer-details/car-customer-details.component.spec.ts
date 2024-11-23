import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarCustomerDetailsComponent } from './car-customer-details.component';

describe('CarCustomerDetailsComponent', () => {
  let component: CarCustomerDetailsComponent;
  let fixture: ComponentFixture<CarCustomerDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CarCustomerDetailsComponent]
    });
    fixture = TestBed.createComponent(CarCustomerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
