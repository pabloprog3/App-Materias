import { Component } from '@angular/core';

/**
 * Generated class for the GraficoTodosAlumnosComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'grafico-todos-alumnos',
  templateUrl: 'grafico-todos-alumnos.html'
})
export class GraficoTodosAlumnosComponent {

  text: string;

  constructor() {
    console.log('Hello GraficoTodosAlumnosComponent Component');
    this.text = 'Hello World';
  }

}
