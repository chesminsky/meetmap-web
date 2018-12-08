import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { environment as e }  from '../../environments/environment';
import { Location } from '@angular/common';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  public form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      username: '',
      password: ''
    });
  }

  public onSubmit() {

    this.auth.login(
      this.form.get('username').value,
      this.form.get('password').value
    ).subscribe(() => {
      this.router.navigate(['map']);
    });
  }

  public google() {
    this.location.go(e.baseUrl + '/auth/google');
  }

}
