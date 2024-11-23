import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { HomeComponent } from './home/home.component';
import { InsuranceCardComponent } from './insurance-card/insurance-card.component';
import { InsurancePageComponent } from './insurance-page/insurance-page.component';
import { CarInsuranceComponent } from './car-insurance/car-insurance.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CarInsurancePremiumComponent } from './car-insurance-premium/car-insurance-premium.component'; 
import { CarCustomerDetailsComponent } from './car-customer-details/car-customer-details.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './Auth/auth.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { DatePipe } from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { LoginCustomerQuoteComponent } from './login-customer-quote/login-customer-quote.component';
import { CustomerDetapdfpageComponent } from './customer-detapdfpage/customer-detapdfpage.component';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    AppComponent,
    // HomeComponent,
    InsuranceCardComponent,
    InsurancePageComponent,
    CarInsuranceComponent,
    CarInsurancePremiumComponent,
    CarCustomerDetailsComponent,
    LoginCustomerQuoteComponent,
    CustomerDetapdfpageComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgSelectModule,
    HttpClientModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule, // Ensure this is included
    MatButtonModule,
    
  ],
  providers: [
    AuthService,DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
