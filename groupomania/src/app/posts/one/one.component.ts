import { Component, OnInit } from '@angular/core';
import { Post } from '../../models/post.model';
import { PostsService } from '../../services/posts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { faFaceAngry, faGrinHearts , faArrowAltCircleLeft, faEdit, faTrashCan} from '@fortawesome/free-regular-svg-icons';
import { catchError, EMPTY, map, Observable, of, switchMap, take, tap } from 'rxjs';
import {CommentsService} from "../../services/comments.service";
import {Comment} from '../../models/comment.model';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-posts-one',
  templateUrl: './one.component.html',
  styleUrls: ['./one.component.scss']
})
export class OneComponent implements OnInit {

  faTrashCan = faTrashCan;
  faEdit = faEdit;
  faArrowAltCircleLeft = faArrowAltCircleLeft;
  faFaceAngry = faFaceAngry;
  faGrinHearts = faGrinHearts;
  loading!: boolean;
  post$!: Observable<Post>;
  comment$!: Observable<Comment[]>;
  userId!: string;
  isAdmin!: boolean;
  likePending!: boolean;
  liked!: boolean;
  disliked!: boolean;
  errorMessage!: string;
  errorCommentMsg!: string;
  loadingComments!: boolean;
  commentForm!: FormGroup;
  errorMsgCommentForm!: string;
  errorMsgComment!: string;

  constructor(
    private formBuilder: FormBuilder,
    private postsService: PostsService,
    private commentsService: CommentsService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.isAdmin = this.auth.getUser().isAdmin;
    console.log('this.isAdmin', this.isAdmin);
    this.userId = this.auth.getUserId();
    this.loading = true;
    this.post$ = this.route.params.pipe(
      map(params => params['id']),
      switchMap(id => this.postsService.getPostById(id)),
      tap(post => {
        this.loading = false;
        if (post.usersLiked.find(user => user === this.userId)) {
          this.liked = true;
        } else if (post.usersDisliked.find(user => user === this.userId)) {
          this.disliked = true;
        }
        this.initEmptyCommentForm(post._id, this.userId);
      })
    );
    const id= this.route.snapshot.params['id'];
    this.comment$ =  this.commentsService.comments$.pipe(
      tap(() => {
        this.loadingComments = false;
        this.errorCommentMsg = '';
      }),
      catchError(error => {
        this.errorCommentMsg = JSON.stringify(error);
        this.loadingComments = false;
        return of([]);
      })
    );
    this.commentsService.getComments(id);
  }

  onLike() {
    if (this.disliked) {
      return;
    }
    this.likePending = true;
    this.post$.pipe(
      take(1),
      switchMap((post: Post) => this.postsService.likePost(post._id, !this.liked).pipe(
        tap(liked => {
          this.likePending = false;
          this.liked = liked;
        }),
        map(liked => ({ ...post, likes: liked ? post.likes + 1 : post.likes - 1 })),
        tap(post => this.post$ = of(post))
      )),
    ).subscribe();
  }

  onDislike() {
    if (this.liked) {
      return;
    }
    this.likePending = true;
    this.post$.pipe(
      take(1),
      switchMap((post: Post) => this.postsService.dislikePost(post._id, !this.disliked).pipe(
        tap(disliked => {
          this.likePending = false;
          this.disliked = disliked;
        }),
        map(disliked => ({ ...post, dislikes: disliked ? post.dislikes + 1 : post.dislikes - 1 })),
        tap(post => this.post$ = of(post))
      )),
    ).subscribe();
  }

  onBack() {
    this.router.navigate(['/list']);
  }

  onModify() {
    this.post$.pipe(
      take(1),
      tap(post => this.router.navigate(['/post', post._id, 'edit']))
    ).subscribe();
  }

  onDelete() {
    this.loading = true;
    this.post$.pipe(
      take(1),
      switchMap(post => this.postsService.deletePost(post._id)),
      tap(message => {
        console.log(message);
        this.loading = false;
        this.router.navigate(['/list']);
      }),
      catchError(error => {
        this.loading = false;
        this.errorMessage = error.message;
        console.error(error);
        return EMPTY;
      })
    ).subscribe();
  }

  onDeleteComment(comment : Comment) {
    console.log(comment._id);

    this.commentsService.deleteComment(comment._id).pipe(
      tap(({ message }) => {
        this.errorMsgComment = '';
        this.router.navigateByUrl('/list', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/post', comment.postId]);
        });
      }),
      catchError(error => {
        console.error(error);
        this.errorMsgComment = error.message;
        return EMPTY;
      })
    ).subscribe();
  }

  initEmptyCommentForm(postId: string, userId: string) {
    this.commentForm = this.formBuilder.group({
      comment: [null, Validators.required],
      userId: [userId, Validators.required],
      postId: [postId, Validators.required]
    });
  }
  onComment()
  {
    const newComment = new Comment();
    newComment.comment = this.commentForm.get('comment')!.value;
    newComment.userId = this.auth.getUserId();
    newComment.postId = this.commentForm.get('postId')!.value;

    this.commentsService.createComment(newComment).pipe(
      tap(({ message }) => {

        this.loading = false;
        console.log('heeeeere', newComment);
        this.router.navigateByUrl('/list', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/post', newComment.postId]);
        });
      }),
      catchError(error => {
        console.error(error);
        this.errorMsgCommentForm = error.message;
        return EMPTY;
      })
    ).subscribe();
  }
}
