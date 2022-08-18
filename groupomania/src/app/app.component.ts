import {Component, OnInit} from '@angular/core';
import {AuthService} from "./services/auth.service";
import {MatDialog} from "@angular/material/dialog";
import {ConsentComponent} from "./dialog/consent.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public isUserLoggedIn: boolean = false;

  constructor(private authService: AuthService,
              private dialog: MatDialog) {

  }

  ngOnInit() {
    this.authService.isAuth$.subscribe((isAuth) => {
      this.isUserLoggedIn = isAuth;
      const hasApprouved = this.authService.getUser().hasApprouved;
      if(isAuth && !hasApprouved)
      {
        this.dialog.open(ConsentComponent, {
          hasBackdrop: false
        });
      }
      console.log('isUserLoggedIn', this.isUserLoggedIn);
    });

  }


  // openDialog() {
  //
  //   const dialogConfig = new MatDialogConfig();
  //
  //   dialogConfig.disableClose = true;
  //   dialogConfig.autoFocus = true;
  //
  //   this.dialog.open(ConsentComponent, dialogConfig);
  // }

}
