import {Component} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {AuthService} from "../services/auth.service";
import {catchError, EMPTY, tap} from "rxjs";

@Component({
  selector: 'app-consent',
  templateUrl: './consent.component.html',
  styleUrls: ['./consent.component.scss']
})
export class ConsentComponent {

  constructor(
    private dialogRef: MatDialogRef<ConsentComponent>,
    private auth: AuthService,
  ) {}

  approuved()
  {
    console.log('approuved',this.auth.getUser());
    this.auth.userhasApprouved(this.auth.getUser().userId).pipe(
      tap((message)=>{
        this.dialogRef.close();
      }),
      catchError(error => {
        console.error(error);
        return EMPTY;
      })
    ).subscribe();
  }

}
