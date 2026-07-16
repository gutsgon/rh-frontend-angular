import { Component, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuncionarioService } from '../../../core/services/funcionario.service';
import { FeriasService } from '../../../core/services/ferias.service';
import { HistoricoService } from '../../../core/services/historico.service';
import { FuncionarioDetalhes as FuncionarioDetalhesModel } from '../../../core/models/funcionario.model';
import { Ferias } from '../../../core/models/ferias.model';
import { HistoricoAlteracao } from '../../../core/models/historico.model';

@Component({
  selector: 'app-funcionario-detalhes',
  imports: [
    RouterLink,
    DatePipe,
    DecimalPipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTableModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './funcionario-detalhes.html',
  styleUrl: './funcionario-detalhes.scss',
})
export class FuncionarioDetalhes {
  private readonly route = inject(ActivatedRoute);
  private readonly funcionarioService = inject(FuncionarioService);
  private readonly feriasService = inject(FeriasService);
  private readonly historicoService = inject(HistoricoService);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly id = Number(this.route.snapshot.paramMap.get('id'));
  protected readonly detalhes = signal<FuncionarioDetalhesModel | null>(null);
  protected readonly ferias = signal<Ferias[]>([]);
  protected readonly historico = signal<HistoricoAlteracao[]>([]);
  protected readonly carregando = signal(true);
  protected readonly erro = signal<string | null>(null);
  protected readonly desligando = signal(false);

  protected readonly colunasFerias = ['dataInicio', 'dataFim', 'status'];
  protected readonly colunasHistorico = ['dataAlteracao', 'campoAlterado', 'valorAntigo', 'valorNovo'];

  constructor() {
    this.carregar();
  }

  private carregar(): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.funcionarioService.obterDetalhes(this.id).subscribe({
      next: (detalhes) => {
        this.detalhes.set(detalhes);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Funcionário não encontrado.');
        this.carregando.set(false);
      },
    });

    this.feriasService.listarPorFuncionario(this.id).subscribe({
      next: (ferias) => this.ferias.set(ferias),
      error: () => this.ferias.set([]),
    });

    this.historicoService.listarPorFuncionario(this.id).subscribe({
      next: (historico) => this.historico.set(historico),
      error: () => this.historico.set([]),
    });
  }

  protected desligar(): void {
    const detalhes = this.detalhes();
    if (!detalhes || !confirm(`Confirma o desligamento de ${detalhes.nome}?`)) {
      return;
    }

    this.desligando.set(true);
    const cargoAtual = detalhes.cargos[0]?.nome ?? '';

    this.funcionarioService
      .atualizar({
        id: this.id,
        nome: detalhes.nome,
        dataAdmissao: detalhes.dataAdmissao,
        salario: detalhes.salario,
        status: false,
        cargoAntigo: { nome: cargoAtual },
        cargoNovo: { nome: cargoAtual },
      })
      .subscribe({
        next: () => {
          this.snackBar.open('Funcionário desligado.', 'Fechar', { duration: 4000 });
          this.desligando.set(false);
          this.carregar();
        },
        error: () => {
          this.snackBar.open('Não foi possível desligar o funcionário.', 'Fechar', { duration: 4000 });
          this.desligando.set(false);
        },
      });
  }
}
