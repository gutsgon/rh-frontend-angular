import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FeriasService } from '../../../core/services/ferias.service';
import { Ferias } from '../../../core/models/ferias.model';
import { FuncionarioRead } from '../../../core/services/funcionario.service';

export interface FeriasFormDialogData {
  ferias: Ferias | null;
  funcionarios: FuncionarioRead[];
}

@Component({
  selector: 'app-ferias-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './ferias-form-dialog.html',
  styleUrl: './ferias-form-dialog.scss',
})
export class FeriasFormDialog {
  private readonly fb = inject(FormBuilder);
  private readonly feriasService = inject(FeriasService);
  private readonly dialogRef = inject(MatDialogRef<FeriasFormDialog>);
  protected readonly data = inject<FeriasFormDialogData>(MAT_DIALOG_DATA);

  protected readonly salvando = signal(false);
  protected readonly erro = signal<string | null>(null);
  protected readonly modoEdicao = this.data.ferias !== null;

  protected readonly form = this.fb.nonNullable.group({
    idFuncionario: [this.data.ferias?.idFuncionario ?? null, Validators.required],
    dataInicio: [this.data.ferias?.dataInicio.substring(0, 10) ?? '', Validators.required],
    dataFim: [this.data.ferias?.dataFim.substring(0, 10) ?? '', Validators.required],
  });

  protected salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const valores = this.form.getRawValue();
    this.salvando.set(true);
    this.erro.set(null);

    const request = this.modoEdicao
      ? this.feriasService.atualizar({
          id: this.data.ferias!.id,
          idFuncionario: valores.idFuncionario!,
          dataInicio: valores.dataInicio,
          dataFim: valores.dataFim,
        })
      : this.feriasService.criar({
          idFuncionario: valores.idFuncionario!,
          dataInicio: valores.dataInicio,
          dataFim: valores.dataFim,
        });

    request.subscribe({
      next: (ferias) => {
        this.salvando.set(false);
        this.dialogRef.close(ferias);
      },
      error: (err) => {
        this.salvando.set(false);
        const httpError = err as { error?: { error?: string } };
        this.erro.set(httpError?.error?.error ?? 'Não foi possível salvar as férias.');
      },
    });
  }

  protected cancelar(): void {
    this.dialogRef.close(null);
  }
}
