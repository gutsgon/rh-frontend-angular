import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuncionarioService } from '../../../core/services/funcionario.service';
import { CargoService } from '../../../core/services/cargo.service';
import { CargoRead } from '../../../core/models/cargo.model';

@Component({
  selector: 'app-funcionario-form',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './funcionario-form.html',
  styleUrl: './funcionario-form.scss',
})
export class FuncionarioForm {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly funcionarioService = inject(FuncionarioService);
  private readonly cargoService = inject(CargoService);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly cargos = signal<CargoRead[]>([]);
  protected readonly novoCargoNome = signal('');
  protected readonly mostrarNovoCargo = signal(false);
  protected readonly carregando = signal(false);
  protected readonly salvando = signal(false);

  protected readonly funcionarioId: number | null = this.route.snapshot.paramMap.get('id')
    ? Number(this.route.snapshot.paramMap.get('id'))
    : null;
  protected readonly modoEdicao = this.funcionarioId !== null;

  private cargoOriginal = '';

  protected readonly form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.maxLength(150)]],
    dataAdmissao: ['', Validators.required],
    salario: [0, [Validators.required, Validators.min(0)]],
    status: [true],
    cargo: ['', Validators.required],
  });

  constructor() {
    this.carregarCargos();

    if (this.modoEdicao && this.funcionarioId !== null) {
      this.carregando.set(true);
      this.funcionarioService.obterDetalhes(this.funcionarioId).subscribe({
        next: (detalhes) => {
          const cargoAtual = detalhes.cargos[0]?.nome ?? '';
          this.cargoOriginal = cargoAtual;
          this.form.patchValue({
            nome: detalhes.nome,
            dataAdmissao: detalhes.dataAdmissao.substring(0, 10),
            salario: detalhes.salario,
            status: detalhes.status,
            cargo: cargoAtual,
          });
          this.carregando.set(false);
        },
        error: () => {
          this.snackBar.open('Não foi possível carregar os dados do funcionário.', 'Fechar', { duration: 4000 });
          this.carregando.set(false);
        },
      });
    }
  }

  private carregarCargos(): void {
    this.cargoService.listar().subscribe({
      next: (cargos) => this.cargos.set(cargos),
      error: () => this.cargos.set([]),
    });
  }

  protected alternarNovoCargo(): void {
    this.mostrarNovoCargo.update((v) => !v);
    this.novoCargoNome.set('');
  }

  protected criarCargo(): void {
    const nome = this.novoCargoNome().trim();
    if (!nome) {
      return;
    }

    this.cargoService.criar({ nome }).subscribe({
      next: (cargo) => {
        this.cargos.update((atual) => [...atual, cargo]);
        this.form.patchValue({ cargo: cargo.nome });
        this.mostrarNovoCargo.set(false);
        this.novoCargoNome.set('');
      },
      error: () => {
        this.snackBar.open('Não foi possível criar o cargo (talvez ele já exista).', 'Fechar', { duration: 4000 });
      },
    });
  }

  protected salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const valores = this.form.getRawValue();
    this.salvando.set(true);

    if (this.modoEdicao && this.funcionarioId !== null) {
      this.funcionarioService
        .atualizar({
          id: this.funcionarioId,
          nome: valores.nome,
          dataAdmissao: valores.dataAdmissao,
          salario: valores.salario,
          status: valores.status,
          cargoAntigo: { nome: this.cargoOriginal },
          cargoNovo: { nome: valores.cargo },
        })
        .subscribe({
          next: () => {
            this.snackBar.open('Funcionário atualizado com sucesso.', 'Fechar', { duration: 4000 });
            this.router.navigate(['/funcionarios', this.funcionarioId]);
          },
          error: (err) => {
            this.salvando.set(false);
            this.snackBar.open(this.extrairErro(err), 'Fechar', { duration: 5000 });
          },
        });
    } else {
      this.funcionarioService
        .criar({
          nome: valores.nome,
          dataAdmissao: valores.dataAdmissao,
          salario: valores.salario,
          status: valores.status,
          cargo: { nome: valores.cargo },
        })
        .subscribe({
          next: (novo) => {
            this.snackBar.open('Funcionário cadastrado com sucesso.', 'Fechar', { duration: 4000 });
            this.router.navigate(['/funcionarios', novo.id]);
          },
          error: (err) => {
            this.salvando.set(false);
            this.snackBar.open(this.extrairErro(err), 'Fechar', { duration: 5000 });
          },
        });
    }
  }

  private extrairErro(err: unknown): string {
    const httpError = err as { error?: { error?: string } };
    return httpError?.error?.error ?? 'Não foi possível salvar o funcionário.';
  }
}
