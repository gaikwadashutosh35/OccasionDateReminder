import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';

interface User {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  gender: string;
  password: string;
  role: string;
  is_active: boolean;
}

interface Occasion {
  id?: number | string;
  occasion_name: string;
  occasion_date: string;
  user_id?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:3000/api';
  private usersUrl = `http://localhost:3000/api/allUsers`;
  private occasionsUrl = `${this.baseUrl}/occasionreminderdate`;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl);
  }

  getAllOccasions(userId:string): Observable<Occasion[]> {
    return this.http.get<Occasion[]>(`${this.occasionsUrl}?user_id=${userId}`);
  }

  signup(inputdata: any) {
    return this.http.post<any>(this.usersUrl, inputdata);
  }

  login(username: string): Observable<any> {
    return this.http.get<any>(`${this.usersUrl}?=q${username}`).pipe(
      map((response) => {
        const user = response.find((item: any) => item.username === username);
        if (user) {
          const userId = user.id;
          return { ...user, userId };
        }
        return null;
      })
    );
  }

  isloggedin() {
    return sessionStorage.getItem('username') != null;
  }

  getUserByCode(id: any): Observable<any> {
    return this.http.get<any>(`${this.usersUrl}?=q${id}`);
  }

  updateUser(id: any, inputdata: any): Observable<any> {
    return this.http.put<any>(`${this.usersUrl}/${id}`, inputdata);
  }

  getRole(): string {
    return sessionStorage.getItem('role') || '';
  }

  getUser(username: string): Observable<User> {
    return this.http.get<User>(`${this.usersUrl}/${username}`);
  }

  getUserRole(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/role`);
  }

  getOccasions(userId: string): Observable<Occasion[]> {
    return this.http.get<Occasion[]>(`${this.occasionsUrl}?user_id=${userId}`);
  }

  addOccasion(occasion: Occasion, userId: string): Observable<any> {
    occasion.user_id = userId;
    return this.http.post<any>(this.occasionsUrl, occasion);
  }

  deleteOccasion(occasionId: string): Observable<any> {
    return this.http.delete<any>(`${this.occasionsUrl}/${occasionId}`);
  }

  updateOccasion(id: string, occasion: Occasion): Observable<any> {
    return this.http.put<any>(`${this.occasionsUrl}/${id}`, occasion);
  }

  getAccessByRole(role: any, menu: any): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/roleaccess?role=${role}&menu=${menu}`
    );
  }
}
