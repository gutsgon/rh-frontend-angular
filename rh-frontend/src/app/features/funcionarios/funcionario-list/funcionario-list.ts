import { Component, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuncionarioService, FuncionarioRead } from '../../../core/services/funcionario.service';
import { CargoService } from '../../../core/services/cargo.service';
import { CargoRead } from '../../../core/models/cargo.model';

@Component({
  selector: 'app-funcionario-list',
  imports: [
    RouterLink,
    DatePipe,
    DecimalPipe,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './funcionario-list.html',
  styleUrl: './funcionario-list.scss',
})
export class FuncionarioList {
  private readonly funcionarioService = inject(FuncionarioService);
  private readonly cargoService = inject(CargoService);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly funcionarios = signal<FuncionarioRead[]>([]);
  protected readonly cargos = signal<CargoRead[]>([]);
  protected readonly cargoSelecionado = signal<string>('');
  protected readonly carregando = signal(true);
  protected readonly erro = signal<string | null>(null);
  protected readonly desligandoId = signal<number | null>(null);

  protected readonly colunas = ['nome', 'dataAdmissao', 'salario', 'status', 'acoes'];

  constructor() {
    this.carregarFuncionarios();
    this.cargoService.listar().subscribe({
      next: (cargos) => this.cargos.set(cargos),
      error: () => this.cargos.set([]),
    });
  }

  protected carregarFuncionarios(): void {
    this.carregando.set(true);
    this.erro.set(null);

    const cargo = this.cargoSelecionado();
    const request = cargo ? this.funcionarioService.listarPorCargo(cargo) : this.funcionarioService.listarTodos();

    request.subscribe({
      next: (funcionarios) => {
        this.funcionarios.set(funcionarios);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar os funcionários.');
        this.carregando.set(false);
      },
    });
  }

  protected filtrarPorCargo(cargo: string): void {
    this.cargoSelecionado.set(cargo);
    this.carregarFuncionarios();
  }

  protected desligar(funcionario: FuncionarioRead): void {
    if (!confirm(`Confirma o desligamento de ${funcionario.nome}?`)) {
      return;
    }

    this.desligandoId.set(funcionario.id);

    this.funcionarioService.obterDetalhes(funcionario.id).subscribe({
      next: (detalhes) => {
        const cargoAtual = detalhes.cargos[0]?.nome ?? '';
        this.funcionarioService
          .atualizar({
            id: funcionario.id,
            nome: funcionario.nome,
            dataAdmissao: funcionario.dataAdmissao,
            salario: funcionario.salario,
            status: false,
            cargoAntigo: { nome: cargoAtual },
            cargoNovo: { nome: cargoAtual },
          })
          .subscribe({
            next: () => {
              this.snackBar.open(`${funcionario.nome} foi desligado(a).`, 'Fechar', { duration: 4000 });
              this.desligandoId.set(null);
              this.carregarFuncionarios();
            },
            error: () => {
              this.snackBar.open('Não foi possível desligar o funcionário.', 'Fechar', { duration: 4000 });
              this.desligandoId.set(null);
            },
          });
      },
      error: () => {
        this.snackBar.open('Não foi possível carregar os dados do funcionário.', 'Fechar', { duration: 4000 });
        this.desligandoId.set(null);
      },
    });
  }
}
