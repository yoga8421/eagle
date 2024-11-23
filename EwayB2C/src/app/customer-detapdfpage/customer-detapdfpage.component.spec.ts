import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDetapdfpageComponent } from './customer-detapdfpage.component';

describe('CustomerDetapdfpageComponent', () => {
  let component: CustomerDetapdfpageComponent;
  let fixture: ComponentFixture<CustomerDetapdfpageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerDetapdfpageComponent]
    });
    fixture = TestBed.createComponent(CustomerDetapdfpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
