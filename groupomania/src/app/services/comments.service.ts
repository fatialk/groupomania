import {Injectable} from '@angular/core';
import {catchError, of, Subject, tap, throwError} from 'rxjs';
import {Comment} from '../models/comment.model';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  comments$ = new Subject<Comment[]>();

  constructor(private http: HttpClient) {}


  getComments(postId: string) {
    this.http.get<Comment[]>('http://localhost:3000/api/comments/post/' + postId).pipe(
      tap(comments => this.comments$.next(comments)),
      catchError(error => {
        console.error(error.error.message);
        return of([]);
      })
    ).subscribe();
  }

  createComment(comment: Comment) {
    return this.http.post<{ message: string }>('http://localhost:3000/api/comments', comment).pipe(
      catchError(error => throwError(error.error.message))
    );
  }

  deleteComment(id: string) {
    return this.http.delete<{ message: string }>('http://localhost:3000/api/comments/' + id).pipe(
      catchError(error => throwError(error.error.message))
    );
  }
}
