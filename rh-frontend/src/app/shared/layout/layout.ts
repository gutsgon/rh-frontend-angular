import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
  protected readonly links = [
    { path: '/principal', label: 'Principal', icon: 'home' },
    { path: '/funcionarios', label: 'Funcionários', icon: 'group' },
    { path: '/ferias', label: 'Férias', icon: 'beach_access' },
    { path: '/relatorio', label: 'Relatório', icon: 'picture_as_pdf' },
  ];
}
