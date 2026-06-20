import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SalesforceService, ValidationRule } from '../../services/salesforce';
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
})
export class DashboardComponent implements OnInit {
  rules: ValidationRule[] = [];
  originalRules: ValidationRule[] = [];
  loading = false;
  error = '';

  constructor(private sf: SalesforceService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (!this.sf.isLoggedIn()) {
      window.location.href = '/';
    }
  }

  fetchRules() {
    this.loading = true;
    this.error = '';
    this.sf.getValidationRules().subscribe({
      next: (data) => {
        this.rules = data;
        this.originalRules = JSON.parse(JSON.stringify(data));
        this.loading = false;
        this.cdr.markForCheck(); 
      },
      error: (err) => {
        this.error = 'Failed to fetch validation rules. Check console.';
        console.error(err);
        this.loading = false;
        this.cdr.markForCheck(); 
      },
    });
  }

  toggle(rule: ValidationRule) {
    rule.Active = !rule.Active; // local only, not yet deployed
  }

  enableAll() {
    this.rules.forEach((r) => (r.Active = true));
  }

  disableAll() {
    this.rules.forEach((r) => (r.Active = false));
  }

  deployChanges() {
  const changed = this.rules.filter((rule, i) => rule.Active !== this.originalRules[i]?.Active);

  if (changed.length === 0) return;

  this.loading = true;
  this.error = '';
  this.cdr.markForCheck();

  const requests = changed.map((rule) =>
    this.sf.updateValidationRuleStatus(rule.Id, rule.Active).pipe(
      catchError((err) => {
        console.error('Failed to update', rule.ValidationName, err);
        return of({ failed: true, ruleName: rule.ValidationName });
      })
    )
  );

  forkJoin(requests).subscribe((results) => {
    this.loading = false;
    const failures = results.filter((r: any) => r?.failed);

    if (failures.length === 0) {
      this.originalRules = JSON.parse(JSON.stringify(this.rules));
      alert('All changes deployed successfully.');
    } else if (failures.length === changed.length) {
      this.error = 'Deploy failed — no changes were saved. Check your connection and try again.';
    } else {
      const failedNames = failures.map((f: any) => f.ruleName).join(', ');
      this.error = `Partially deployed. Failed: ${failedNames}. Successful changes were saved — retry the failed ones.`;
      // refresh originalRules to reflect what actually succeeded
      this.originalRules = JSON.parse(JSON.stringify(this.rules));
    }
    this.cdr.markForCheck();
  });
}

  rollback() {
    this.rules = JSON.parse(JSON.stringify(this.originalRules));
  }

  logout() {
    this.sf.logout();
    window.location.href = '/';
  }
}