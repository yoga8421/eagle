import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-customer-detapdfpage',
  templateUrl: './customer-detapdfpage.component.html',
  styleUrls: ['./customer-detapdfpage.component.scss']
})
export class CustomerDetapdfpageComponent implements OnInit {
  registrationForm: FormGroup;
  titles = ['Mr', 'Ms', 'Mrs', 'Dr'];
  identityTypes = ['National ID', 'Passport', 'Driving License'];
  countries = ['Tanzania', 'Kenya', 'Uganda', 'Rwanda'];
  
  constructor(private fb: FormBuilder) {
    this.registrationForm = this.fb.group({
      title: ['', Validators.required],
      occupation: ['', Validators.required],
      identityType: ['', Validators.required],
      countryCode: ['255', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      country: ['', Validators.required],
      region: ['', Validators.required],
      district: ['', Validators.required],
      poBox: ['', Validators.required],
      notification: ['SMS', Validators.required],
      businessType: ['Low', Validators.required],
      taxExempted: ['No', Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.registrationForm.valid) {
      console.log('Form Submitted', this.registrationForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
