import {Component, OnInit, Input} from '@angular/core';
import {catchError, Observable, of, tap} from 'rxjs';
import {Post} from '../../models/post.model';
import {PostsService} from '../../services/posts.service';
import { faFaceAngry, faGrinHearts } from '@fortawesome/free-regular-svg-icons';
import {Router} from "@angular/router";

@Component({
  selector: 'app-posts-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})


export class ListComponent implements OnInit {

  faFaceAngry = faFaceAngry;
  faGrinHearts = faGrinHearts;
  posts$!: Observable<Post[]>;
  buttonText!: string;
  loading!: boolean;
  errorMsg!: string;

  constructor(private postsService: PostsService,
              private router: Router) {
  }

  ngOnInit() {
    this.buttonText = `J'aime`;
    this.loading = true;
    this.posts$ = this.postsService.posts$.pipe(
      tap(() => {
        this.loading = false;
        this.errorMsg = '';
      }),
      catchError(error => {
        this.errorMsg = JSON.stringify(error);
        this.loading = false;
        return of([]);
      })
    );
    this.postsService.getPosts();
  }

  onClickPost(id: string) {
    this.router.navigate(['/post', id]);
  }
}
