import { Component, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FuncionarioService, FuncionarioRead } from '../../core/services/funcionario.service';

@Component({
  selector: 'app-principal',
  imports: [
    RouterLink,
    DatePipe,
    DecimalPipe,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './principal.html',
  styleUrl: './principal.scss',
})
export class Principal {
  private readonly funcionarioService = inject(FuncionarioService);

  protected readonly funcionarios = signal<FuncionarioRead[]>([]);
  protected readonly salarioMedio = signal<number | null>(null);
  protected readonly carregando = signal(true);
  protected readonly erro = signal<string | null>(null);

  protected readonly colunas = ['nome', 'dataAdmissao', 'salario', 'status', 'acoes'];

  constructor() {
    this.carregar();
  }

  private carregar(): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.funcionarioService.listarTodos().subscribe({
      next: (funcionarios) => {
        this.funcionarios.set(funcionarios);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar os funcionários. Verifique se a API está no ar.');
        this.carregando.set(false);
      },
    });

    this.funcionarioService.calcularMediaSalario().subscribe({
      next: (media) => this.salarioMedio.set(media.salarioMedio),
      error: () => this.salarioMedio.set(null),
    });
  }
}
