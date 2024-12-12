import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  currentUser: { username: string; fullname: string } | null = null;
  initials = this.authService.getUserInitials;

  constructor(private authService: AuthService, private router: Router) { }
  ngOnInit(): void {
    this.fetchCurrentUser()
  }

  fetchCurrentUser() {
    this.authService.getCurrentUser().subscribe({
      next: (user) => (this.currentUser = user || null),
      error: (err) => console.error('Failed to fetch current user:', err)
    });
  }
  onLogout() {
    this.authService.logOutCurrentUser().subscribe({
      next: () => (console.log("done")),
      error: (err) => console.error('Failed to Log out current user:', err)
    });
    console.log('Logging out...');
    this.router.navigate(['/']).then(() => window.location.reload())
  }
}
