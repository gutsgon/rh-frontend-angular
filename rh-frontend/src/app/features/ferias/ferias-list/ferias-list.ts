import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FeriasService } from '../../../core/services/ferias.service';
import { FuncionarioService, FuncionarioRead } from '../../../core/services/funcionario.service';
import { Ferias } from '../../../core/models/ferias.model';
import { FeriasFormDialog, FeriasFormDialogData } from '../ferias-form-dialog/ferias-form-dialog';

@Component({
  selector: 'app-ferias-list',
  imports: [DatePipe, MatTableModule, MatButtonModule, MatIconModule, MatChipsModule, MatProgressSpinnerModule],
  templateUrl: './ferias-list.html',
  styleUrl: './ferias-list.scss',
})
export class FeriasList {
  private readonly feriasService = inject(FeriasService);
  private readonly funcionarioService = inject(FuncionarioService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly ferias = signal<Ferias[]>([]);
  protected readonly funcionarios = signal<FuncionarioRead[]>([]);
  protected readonly carregando = signal(true);
  protected readonly erro = signal<string | null>(null);

  protected readonly nomesPorId = computed(() => {
    const mapa = new Map<number, string>();
    for (const f of this.funcionarios()) {
      mapa.set(f.id, f.nome);
    }
    return mapa;
  });

  protected readonly colunas = ['funcionario', 'dataInicio', 'dataFim', 'status', 'acoes'];

  constructor() {
    this.carregar();
  }

  private carregar(): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.funcionarioService.listarTodos().subscribe({
      next: (funcionarios) => this.funcionarios.set(funcionarios),
      error: () => this.funcionarios.set([]),
    });

    this.feriasService.listarTodas().subscribe({
      next: (ferias) => {
        this.ferias.set(ferias);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar as férias.');
        this.carregando.set(false);
      },
    });
  }

  protected nomeFuncionario(idFuncionario: number): string {
    return this.nomesPorId().get(idFuncionario) ?? `#${idFuncionario}`;
  }

  protected abrirFormulario(ferias: Ferias | null): void {
    const ref = this.dialog.open<FeriasFormDialog, FeriasFormDialogData, Ferias | null>(FeriasFormDialog, {
      data: { ferias, funcionarios: this.funcionarios() },
    });

    ref.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this.snackBar.open('Férias salvas com sucesso.', 'Fechar', { duration: 4000 });
        this.carregar();
      }
    });
  }

  protected excluir(ferias: Ferias): void {
    if (!confirm(`Excluir o registro de férias de ${this.nomeFuncionario(ferias.idFuncionario)}?`)) {
      return;
    }

    this.feriasService.excluir(ferias.id).subscribe({
      next: () => {
        this.snackBar.open('Registro de férias excluído.', 'Fechar', { duration: 4000 });
        this.carregar();
      },
      error: () => {
        this.snackBar.open('Não foi possível excluir o registro de férias.', 'Fechar', { duration: 4000 });
      },
    });
  }
}
