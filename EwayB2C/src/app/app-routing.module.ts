// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';

// const routes: Routes = [];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }




import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { HomeComponent } from './home/home.component';
import { InsuranceCardComponent } from './insurance-card/insurance-card.component';
import { InsurancePageComponent } from './insurance-page/insurance-page.component';
import { CarInsuranceComponent } from './car-insurance/car-insurance.component';
import { CarInsurancePremiumComponent } from './car-insurance-premium/car-insurance-premium.component';
import { CarCustomerDetailsComponent } from './car-customer-details/car-customer-details.component';
import { LoginCustomerQuoteComponent } from './login-customer-quote/login-customer-quote.component';
import { CustomerDetapdfpageComponent } from './customer-detapdfpage/customer-detapdfpage.component';

const routes: Routes = [
  { path: '', component: InsurancePageComponent }, // Default route
  { path: 'insurance', component: InsuranceCardComponent },// Route for the InsurancePageComponent
  { path: 'car-insurance', component: CarInsuranceComponent },
  { path: 'car-insurance-premium', component: CarInsurancePremiumComponent },
  { path: 'car-customer-details', component: CarCustomerDetailsComponent },
  { path: 'login-customer-quote',component:LoginCustomerQuoteComponent},
  { path: 'customer-detapdfpage',component:CustomerDetapdfpageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
