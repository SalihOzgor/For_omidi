import { Component, OnInit, OnDestroy } from '@angular/core';
import { Student } from '../models/student.model';
import { StudentService } from '../services/student.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common'; // CommonModule eklendi

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
  standalone: true,
  imports: [CommonModule], // CommonModule burada kullanılıyor
})
export class StudentsComponent implements OnInit, OnDestroy {
  students: Student[] = [];
  private subscription!: Subscription; // Kesin olarak atanacak

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    // 1. Mevcut verileri yükle
    this.studentService.getAllStudents().subscribe({
      next: (students) => {
        this.students = students; // Tüm öğrencileri tabloya ekle
      },
      error: (err) => {
        console.error('Error loading students:', err);
      },
    });

    // 2. Güncellemeleri dinle
    this.subscription = this.studentService.getStudentUpdates().subscribe({
      next: (student) => {
        console.log('Gelen güncelleme:', student); // Güncellemeleri kontrol et
        const existingIndex = this.students.findIndex((s) => s.id === student.id);

        if (student.firstname === 'DELETED') {
          // Eğer öğrenci silinmiş olarak işaretlendiyse, tablodan kaldır
          if (existingIndex !== -1) {
            this.students.splice(existingIndex, 1); // Öğrenciyi listeden sil
          }
        } else {
          if (existingIndex !== -1) {
            // Eğer öğrenci zaten varsa, güncelle
            this.students[existingIndex] = student;
          } else {
            // Eğer öğrenci yoksa, tabloya ekle
            this.students.push(student);
          }
        }
      },
      error: (err) => {
        console.error('Error receiving updates:', err);
      },
    });

  }


  ngOnDestroy(): void {
    // Aboneliği iptal et ve kaynakları temizle
    this.subscription.unsubscribe();
  }
}
