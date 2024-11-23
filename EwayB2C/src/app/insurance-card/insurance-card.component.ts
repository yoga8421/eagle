import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-insurance-card',
  templateUrl: './insurance-card.component.html',
  styleUrls: ['./insurance-card.component.css']
})
export class InsuranceCardComponent {
  @Input() product!: { name: string, description: string, img: string, type: string };


  constructor(private router: Router) {}

  redirectToCarInsurance() {
    // Navigates to the car insurance page
    this.router.navigate(['/car-insurance']);
  }
}
