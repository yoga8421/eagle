import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-customer-detapdfpage',
  templateUrl: './customer-detapdfpage.component.html',
  styleUrls: ['./customer-detapdfpage.component.scss']
})
export class CustomerDetapdfpageComponent implements OnInit {
  insuranceForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.insuranceForm = this.fb.group({
      title: ['', Validators.required],
      accountType: ['Default', Validators.required], // Default value
      customerName: ['', Validators.required],
      code: ['', Validators.required],
      mobileNo: ['', Validators.required],
      identityType: ['', Validators.required],
      idNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      policyStartDate: ['', Validators.required],
      policyEndDate: ['', Validators.required],
      currency: ['', Validators.required],
      exchangeRate: ['', Validators.required],
      promoCode: ['No', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.insuranceForm.valid) {
      console.log('Form Submitted', this.insuranceForm.value);
    } else {
      console.error('Form Invalid');
    }
  }
}