import { Component } from '@angular/core';
import { SalesforceService } from '../../services/salesforce';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
})
export class LoginComponent {
  constructor(private salesforce: SalesforceService) {}

  login() {
    this.salesforce.login();
  }
}

