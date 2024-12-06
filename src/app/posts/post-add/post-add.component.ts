import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';
import { Post } from 'src/app/model/post';

@Component({
  selector: 'app-post-add',
  templateUrl: './post-add.component.html',
  styleUrls: ['./post-add.component.scss']
})
export class PostAddComponent implements OnInit {
  myForm!: FormGroup;
  currentUser: { username: string; fullname: string } | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  initials = this.authService.getUserInitials;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.fetchCurrentUser();
  }

  private initializeForm(): void {
    this.myForm = this.fb.group({
      description: [null, [Validators.required]],
      image: [null]
    });
  }

  add(): void {
    if (this.myForm.invalid) {
      alert('Please fill in the required fields.');
      return;
    }

    const newPost: Post = {
      id: this.generateUniqueId(),
      username: this.currentUser?.username || 'GuestUser',
      fullname: this.currentUser?.fullname || 'Guest User',
      description: this.myForm.value.description,
      media: this.imagePreview ? this.imagePreview.toString() : '',
      interactions: { shares: 0, comments: 0, likes: 0 },
      liked: false,
      createdDate: new Date().getTime().toString()
    };

    this.authService.addPost(newPost).subscribe({
      next: () => {
        alert('Post added successfully!');
        this.router.navigate(['/']).then(() => window.location.reload());
      },
      error: (err) => {
        console.error('Failed to add post:', err);
        alert('Error adding post. Please try again.');
      }
    });
  }

  resizeTextarea(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  private fetchCurrentUser(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => (this.currentUser = user || null),
      error: (err) => {
        console.error('Failed to fetch current user:', err);
        alert('Error fetching user details. Please log in again.');
      }
    });
  }

  private generateUniqueId(): string {
    return Math.random().toString(36).substring(2, 8);
  }
}
