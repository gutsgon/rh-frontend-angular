import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HistoricoAlteracao } from '../models/historico.model';

@Injectable({ providedIn: 'root' })
export class HistoricoService {
  private readonly http = inject(HttpClient);
  private readonly rootUrl = `${environment.hostUrl}/historico`;

  listarPorFuncionario(idFuncionario: number): Observable<HistoricoAlteracao[]> {
    return this.http.get<HistoricoAlteracao[]>(`${this.rootUrl}/filtrar/${idFuncionario}`);
  }
}
