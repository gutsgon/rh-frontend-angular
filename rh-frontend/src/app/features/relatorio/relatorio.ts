import { Component, DestroyRef, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RelatorioService } from '../../core/services/relatorio.service';

@Component({
  selector: 'app-relatorio',
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './relatorio.html',
  styleUrl: './relatorio.scss',
})
export class Relatorio {
  private readonly relatorioService = inject(RelatorioService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly destroyRef = inject(DestroyRef);

  private objectUrl: string | null = null;

  protected readonly gerando = signal(false);
  protected readonly erro = signal<string | null>(null);
  protected readonly pdfUrl = signal<SafeResourceUrl | null>(null);
  protected readonly downloadUrl = signal<string | null>(null);

  constructor() {
    this.destroyRef.onDestroy(() => this.liberarUrlAnterior());
  }

  protected gerar(): void {
    this.gerando.set(true);
    this.erro.set(null);

    this.relatorioService.gerarRelatorioFuncionariosPdf().subscribe({
      next: (pdf) => {
        this.liberarUrlAnterior();
        this.objectUrl = URL.createObjectURL(pdf);
        this.downloadUrl.set(this.objectUrl);
        this.pdfUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(this.objectUrl));
        this.gerando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível gerar o relatório. Verifique se há funcionários cadastrados.');
        this.gerando.set(false);
      },
    });
  }

  private liberarUrlAnterior(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
  }
}
