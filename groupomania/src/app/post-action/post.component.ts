import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PostsService } from '../services/posts.service';
import { Post } from '../models/post.model';
import { AuthService } from '../services/auth.service';
import { catchError, EMPTY, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  postForm!: FormGroup;
  mode!: string;
  loading!: boolean;
  post!: Post;
  errorMsg!: string;
  imagePreview!: string;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private postsService: PostsService,
              private auth: AuthService) { }

  ngOnInit() {
    console.log(this.auth.getUserId());
    this.loading = true;
    this.route.params.pipe(
      switchMap(params => {
        if (!params['id']) {
          this.mode = 'new';
          this.initEmptyForm();
          this.loading = false;
          return EMPTY;
        } else {
          this.mode = 'edit';
          return this.postsService.getPostById(params['id'])
        }
      }),
      tap(post => {
        if (post) {
          this.post = post;
          this.initModifyForm(post);
          this.loading = false;
        }
      }),
      catchError(error => this.errorMsg = JSON.stringify(error))
    ).subscribe();
  }

  initEmptyForm() {
    this.postForm = this.formBuilder.group({
      title: [null, Validators.required],
      description: [null, Validators.required],
      image: [null, Validators.required]
    });
  }

  initModifyForm(post: Post) {
    this.postForm = this.formBuilder.group({
      title: [post.title, Validators.required],
      description: [post.description, Validators.required],
      image: [post.imageUrl, Validators.required]
    });
    this.imagePreview = this.post.imageUrl;
  }

  onSubmit() {
    this.loading = true;
    const newPost = new Post();
    newPost.title = this.postForm.get('title')!.value;
    newPost.description = this.postForm.get('description')!.value;
    newPost.userId = this.auth.getUserId();
    if (this.mode === 'new') {
      this.postsService.createPost(newPost, this.postForm.get('image')!.value).pipe(
        tap(({ message }) => {
          console.log(message);
          this.loading = false;
          this.router.navigate(['/list']);
        }),
        catchError(error => {
          console.error(error);
          this.loading = false;
          this.errorMsg = error.message;
          return EMPTY;
        })
      ).subscribe();
    } else if (this.mode === 'edit') {
      this.postsService.modifyPost(this.post._id, newPost, this.postForm.get('image')!.value).pipe(
        tap(({ message }) => {
          console.log(message);
          this.loading = false;
          this.router.navigate(['/list']);
        }),
        catchError(error => {
          console.error(error);
          this.loading = false;
          this.errorMsg = error.message;
          return EMPTY;
        })
      ).subscribe();
    }
  }

  onFileAdded(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.postForm.get('image')!.setValue(file);
    this.postForm.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
