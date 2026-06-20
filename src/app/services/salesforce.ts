import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export interface ValidationRule {
  Id: string;
  ValidationName: string;
  Active: boolean;
  EntityDefinitionId: string;
  objectName?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SalesforceService {
  private clientId = '3MVG97L7PWbPq6Uxi_tDifEKFcKK7FYMR2q.o2MYohGQtxP6dsDSo4emNCyIvWhQHtjpeNhDPevAcDbzv5eaq';
  private redirectUri = 'http://localhost:4200/callback';
  private apiVersion = 'v60.0';

  constructor(private http: HttpClient) {}

  login() {
    const url =
      `https://login.salesforce.com/services/oauth2/authorize` +
      `?response_type=token` +
      `&client_id=${this.clientId}` +
      `&redirect_uri=${encodeURIComponent(this.redirectUri)}`;

    window.location.href = url;
  }

  logout() {
    localStorage.removeItem('sf_access_token');
    localStorage.removeItem('sf_instance_url');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('sf_access_token');
  }

  private get headers(): HttpHeaders {
    const token = localStorage.getItem('sf_access_token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  private get instanceUrl(): string {
    return localStorage.getItem('sf_instance_url') || '';
  }

  getValidationRules(): Observable<ValidationRule[]> {
    const query = encodeURIComponent(
      'SELECT Id, ValidationName, Active, EntityDefinitionId FROM ValidationRule'
    );
    const url = `${this.instanceUrl}/services/data/${this.apiVersion}/tooling/query/?q=${query}`;

    return this.http
      .get<{ records: ValidationRule[] }>(url, { headers: this.headers })
      .pipe(map((res) => res.records));
  }

  updateValidationRuleStatus(id: string, active: boolean): Observable<any> {
    const getUrl = `${this.instanceUrl}/services/data/${this.apiVersion}/tooling/sobjects/ValidationRule/${id}`;

    return this.http.get<any>(getUrl, { headers: this.headers }).pipe(
      switchMap((fullRule) => {
        const updatedMetadata = { ...fullRule.Metadata, active };
        return this.http.patch(getUrl, { Metadata: updatedMetadata }, { headers: this.headers });
      })
    );
  }
} // <-- this closing brace for the class was missing