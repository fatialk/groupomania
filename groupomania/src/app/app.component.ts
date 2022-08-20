import {Component, OnInit} from '@angular/core';
import {AuthService} from "./services/auth.service";
import {MatDialog} from "@angular/material/dialog";
import {ConsentComponent} from "./dialog/consent.component";
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  public isUserLoggedIn: boolean = false;
  
  constructor(
    private authService: AuthService,
    private dialog: MatDialog
    ) {
      if(['/connexion', '/inscription'].includes(window.location.pathname))
      {
        this.authService.logout();
      }else
      {
        this.authService.refreshUser();
      }
      
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
    
    
  }
  