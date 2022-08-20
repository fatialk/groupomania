import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, catchError, tap, throwError} from 'rxjs';
import {Router} from '@angular/router';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  isAuth$ = new BehaviorSubject<boolean>(false);
  private authToken = '';
  private userId = '';
  private pseudo = '';
  private isAdmin = false;
  private hasApprouved = false;
  
  constructor(private http: HttpClient,
    private router: Router) {}
    
    createUser(email: string, password: string, pseudo: string) {
      return this.http.post<{ message: string }>('http://localhost:3000/api/auth/signup',
      {
        email: email,
        pseudo: pseudo,
        password: password
      });
    }
    
    getUser(){
      return {
        userId: this.userId,
        pseudo: this.pseudo,
        isAdmin: this.isAdmin,
        hasApprouved: this.hasApprouved,
        token: this.authToken
      }
    }
    
    getToken() {
      return this.authToken;
    }
    
    getUserId() {
      return this.userId;
    }
    
    refreshUser()
    {
      const user = localStorage.getItem("user");
      if(user){
        const userObject = JSON.parse(user);
        this.userId = userObject.userId;
        this.authToken = userObject.token;
        this.isAdmin = userObject.isAdmin;
        this.hasApprouved = userObject.hasApprouved;
        this.pseudo = userObject.pseudo;
        this.isAuth$.next(true);
      }
    }
    
    loginUser(email: string, password: string) {
      return this.http.post<User>('http://localhost:3000/api/auth/login',
      {email: email, password: password}).pipe(
        tap(user => {
        
          this.userId = user.userId;
          this.authToken = user.token;
          this.isAdmin = user.isAdmin;
          this.hasApprouved = user.hasApprouved;
          this.pseudo = user.pseudo;
          localStorage.setItem("user", JSON.stringify(user));
          this.isAuth$.next(true);
        })
        );
      }
      
      userhasApprouved(id : string)
      {
        return this.http.put<{ message: string }>('http://localhost:3000/api/auth/users/' + id, {hasApprouved: true}).pipe(
        catchError(error => throwError(error.error.message))
        );
      }
      
      logout() {
        this.authToken = '';
        this.userId = '';
        this.pseudo = '';
        this.isAdmin = false;
        this.hasApprouved = false;
        localStorage.clear();
        this.isAuth$.next(false);
        this.router.navigate(['/connexion']);
      }
      
    }
    