import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Ferias, FeriasCreate, FeriasUpdate } from '../models/ferias.model';

@Injectable({ providedIn: 'root' })
export class FeriasService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/ferias`;
  private readonly rootUrl = `${environment.hostUrl}/ferias`;

  listarTodas(): Observable<Ferias[]> {
    return this.http.get<Ferias[]>(this.apiUrl);
  }

  listarPorFuncionario(idFuncionario: number): Observable<Ferias[]> {
    return this.http.get<Ferias[]>(`${this.rootUrl}/idFuncionario/${idFuncionario}`);
  }

  criar(ferias: FeriasCreate): Observable<Ferias> {
    return this.http.post<Ferias>(this.apiUrl, ferias);
  }

  atualizar(ferias: FeriasUpdate): Observable<Ferias> {
    return this.http.put<Ferias>(this.apiUrl, ferias);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.rootUrl}/${id}`);
  }
}
