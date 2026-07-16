import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  FuncionarioComCargo,
  FuncionarioComCargoCreate,
  FuncionarioComCargoUpdate,
  FuncionarioDetalhes,
  FuncionarioMediaSalario,
} from '../models/funcionario.model';

export interface FuncionarioRead {
  id: number;
  nome: string;
  dataAdmissao: string;
  salario: number;
  status: boolean;
}

@Injectable({ providedIn: 'root' })
export class FuncionarioService {
  private readonly http = inject(HttpClient);

  // A API mistura rotas relativas (api/funcionario) com overrides absolutos
  // (/funcionario/...) por action — os dois grupos abaixo refletem isso.
  private readonly apiUrl = `${environment.apiUrl}/funcionario`;
  private readonly rootUrl = `${environment.hostUrl}/funcionario`;

  listarTodos(): Observable<FuncionarioRead[]> {
    return this.http.get<FuncionarioRead[]>(this.apiUrl);
  }

  listarPorCargo(cargo: string): Observable<FuncionarioRead[]> {
    return this.http.get<FuncionarioRead[]>(`${this.rootUrl}/cargo/${encodeURIComponent(cargo)}`);
  }

  obterDetalhes(id: number): Observable<FuncionarioDetalhes> {
    return this.http.get<FuncionarioDetalhes>(`${this.rootUrl}/detalhes`, { params: { id } });
  }

  calcularMediaSalario(): Observable<FuncionarioMediaSalario> {
    return this.http.get<FuncionarioMediaSalario>(`${this.rootUrl}/salario`);
  }

  criar(funcionario: FuncionarioComCargoCreate): Observable<FuncionarioComCargo> {
    return this.http.post<FuncionarioComCargo>(this.apiUrl, funcionario);
  }

  atualizar(funcionario: FuncionarioComCargoUpdate): Observable<FuncionarioComCargo> {
    return this.http.put<FuncionarioComCargo>(this.apiUrl, funcionario);
  }

  desligar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.rootUrl}/${id}`);
  }
}
