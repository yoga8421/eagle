import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-insurance-page',
  templateUrl: './insurance-page.component.html',
  styleUrls: ['./insurance-page.component.css']
})
export class InsurancePageComponent {

  
  products = [
    { name: 'Motorcycle Insurance', description: "Travel isn't always pretty. It isn't always comfortable.", img: '/assets/images/bike.webp', type: 'motorcycle' },
    { name: 'Home Insurance', description: "", img: '/assets/images/home.webp', type: 'home' },
    { name: 'Car Insurance', description: "Travel isn't always pretty. It isn't always comfortable.", img: '/assets/images/car.webp', type: 'car' },
    { name: 'Health Insurance', description: "", img: '/assets/images/Health.webp', type: 'health' }
  ];
  constructor(private router: Router) {}

  navigateToLogin(): void {
    this.router.navigate(['/login-customer-quote']);

}
}