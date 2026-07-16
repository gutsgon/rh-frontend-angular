import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RelatorioService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/relatorio`;

  gerarRelatorioFuncionariosPdf(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/funcionarios/pdf`, { responseType: 'blob' });
  }
}
