import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  currentUser: { username: string; fullname: string } | null = null;
  initials = this.authService.getUserInitials;
  dropdownVisible: boolean = false;
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

  onPreventClick(event: MouseEvent): void {
    event.stopPropagation();
  }
  toggleDropdown(event: Event) {
    event.stopPropagation(); // Prevent closing when clicking inside the dropdown
    this.dropdownVisible = !this.dropdownVisible;
  }
  @HostListener('document:click')
  closeDropdown(): void {
    this.dropdownVisible = false; // Close dropdown when clicking outside
  }
  onLogout() {
    this.authService.logOutCurrentUser().subscribe({
      next: () => (console.log("done")),
      error: (err) => console.error('Failed to Log out current user:', err)
    });
    // Add your logout logic here, e.g., clearing user data, redirecting to login page
    console.log('Logging out...');
    this.router.navigate(['/']).then(() => window.location.reload())
  }
}
