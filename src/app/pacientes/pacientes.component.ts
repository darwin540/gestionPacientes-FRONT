import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule],
  template: '<div class="card"><h2>Pacientes</h2><p>Próximamente...</p></div>'
})
export class PacientesComponent {
}

