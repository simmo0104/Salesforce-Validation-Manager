import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.html',
})
export class CallbackComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);

    const accessToken = params.get('access_token');
    const instanceUrl = params.get('instance_url');

    if (accessToken) {
      localStorage.setItem('sf_access_token', accessToken);
      localStorage.setItem('sf_instance_url', instanceUrl || '');

      this.router.navigate(['/dashboard']);
    }
  }
}