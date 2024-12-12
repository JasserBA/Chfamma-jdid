import { AuthService } from 'src/app/core/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { min } from 'rxjs';
import { User } from 'src/app/model/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  myFormLogin!: FormGroup
  currentUser: { username: string; fullname: string } | null = null;
  users: User[] = []
  fullname = ""
  filteredUser: User[] = []
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }
  ngOnInit(): void {
    this.initializeForm()
    // this.fetchCurrentUser()
  }

  private initializeForm(): void {
    this.myFormLogin = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required, Validators.min(8)]],
    });
  }

  async doLogin(): Promise<void> {
    if (this.myFormLogin.invalid) {
      alert('Please fill in the required fields.');
      return;
    }
    const newLogin: User = {
      username: this.myFormLogin.value.username,
      fullname: this.fullname,
      password: this.myFormLogin.value.password,
    };
    this.authService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users
      },
      error: (err) => console.error('Failed to fetch users', err)
    });
    if (this.users.find(user => user.username === newLogin.username)) {
      this.filteredUser = this.users.filter(user => user.username == newLogin.username)
      this.fullname = this.filteredUser[0].fullname
      this.authService.loginCurrentUser(newLogin.username, this.fullname).subscribe({
        next: () => {
          // user exist
          alert("user exist! Successfully LOGIN")
          this.router.navigate(['/']).then(() => window.location.reload());
        },
        error: (err) => {
          // user not exist
          alert("user not exist! Failed LOGIN")
          console.error(err);
        }
      });
    } else {
      alert("user not exist! Failed LOGIN")
    }
  }

}
