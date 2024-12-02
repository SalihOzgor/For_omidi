import { Component } from '@angular/core';
import { StudentsComponent } from './students/students.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [StudentsComponent], // HttpClientModule burada da sağlanabilir
  template: `<app-students></app-students>`,
  styleUrls: ['./app.component.css']
})
export class AppComponent {}
