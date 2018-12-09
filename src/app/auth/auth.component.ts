import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

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

}
