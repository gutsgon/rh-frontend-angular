import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CargoRead } from '../models/cargo.model';

@Injectable({ providedIn: 'root' })
export class CargoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/cargo`;

  listar(): Observable<CargoRead[]> {
    return this.http.get<CargoRead[]>(this.baseUrl);
  }

  criar(cargo: { nome: string }): Observable<CargoRead> {
    return this.http.post<CargoRead>(this.baseUrl, cargo);
  }
}
