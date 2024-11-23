import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginCustomerQuoteComponent } from './login-customer-quote.component';

describe('LoginCustomerQuoteComponent', () => {
  let component: LoginCustomerQuoteComponent;
  let fixture: ComponentFixture<LoginCustomerQuoteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginCustomerQuoteComponent]
    });
    fixture = TestBed.createComponent(LoginCustomerQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
