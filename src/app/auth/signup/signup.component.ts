import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  myFormSignup!: FormGroup
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
    this.myFormSignup = this.fb.group({
      username: [null, [Validators.required]],
      fullname: [null, [Validators.required]],
      password: [null, [Validators.required, Validators.min(8)]],
    });
  }

  async doSignup(): Promise<void> {
    if (this.myFormSignup.invalid) {
      alert('Please fill in the required fields.');
      return;
    }
    const newSignup: User = {
      id: this.generateUniqueId(),
      username: this.myFormSignup.value.username,
      fullname: this.myFormSignup.value.fullname,
      password: this.myFormSignup.value.password,
    };
    this.authService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users
      },
      error: (err) => console.error('Failed to fetch users', err)
    });
    if (this.users.find(user => user.username !== newSignup.username)) {
      this.authService.SignupCurrentUser(newSignup).subscribe({
        next: () => {
          // user exist
          alert("user created! Successfully SIGNUP!")
          this.router.navigate(['/login']).then(() => window.location.reload());
        },
        error: (err) => {
          // user not exist
          alert("user not created! Failed SIGNUP")
          console.error(err);
        }
      });
    }
  }

  private generateUniqueId(): string {
    return Math.random().toString(36).substring(2, 8);
  }
}
