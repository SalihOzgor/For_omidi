import { Injectable, NgZone } from '@angular/core';
import { Student } from '../models/student.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private apiUrl = 'http://localhost:8080/api/v1/students/updates';

  constructor(private zone: NgZone) {}

  getAllStudents(): Observable<Student[]> {
    return new Observable<Student[]>((observer) => {
      fetch('http://localhost:8080/api/v1/students') // Tüm öğrencileri al
        .then((response) => response.json())
        .then((data) => {
          observer.next(data); // Observable'a verileri gönder
          observer.complete(); // İşlemi tamamla
        })
        .catch((error) => observer.error(error)); // Hata durumunda bildir
    });
  }


  getStudentUpdates(): Observable<Student> {
    return new Observable<Student>((observer) => {
      const eventSource = new EventSource(this.apiUrl);

      eventSource.onmessage = (event) => {
        this.zone.run(() => {
          observer.next(JSON.parse(event.data));
        });
      };

      eventSource.onerror = (error) => {
        console.error('Connection lost. Reconnecting...', error);
        eventSource.close(); // Mevcut bağlantıyı kapat
        observer.error(error); // Observable'a hata gönder
      };

      return () => {
        eventSource.close(); // Observable tamamlandığında bağlantıyı kapat
      };
    });
  }
}
