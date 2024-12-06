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

  constructor(private fbuilder: FormBuilder, private s: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.addPostForm();
    this.fetchCurrentUser();
  }

  addPostForm(): void {
    this.myForm = this.fbuilder.group({
      description: [null, Validators.required],
    });
  }

  add(): void {
    const newPost: Post = {
      username: this.currentUser?.username || 'GuestUser',
      fullname: this.currentUser?.fullname || 'Guest User',
      description: this.myForm.value.description,
      media: '',
      interactions: {
        shares: 0,
        comments: 0,
        likes: 0,
      },
      liked: false,
      id: this.generateUniqueId()
    };

    this.s.addPost(newPost).subscribe({
      next: (data) => {
        console.log('Post added:', data);
        this.router.navigate(['/home']).then(() => window.location.reload());
        alert('Post added successfully!');
      },
      error: (err) => {
        console.error('Failed to add post:', err);
        alert('Error adding post. Please try again.');
      }
    });
  }

  resizeTextarea(event: any): void {
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  fetchCurrentUser(): void {
    this.s.getCurrentUser().subscribe({
      next: (user) => {
        if (user) {
          console.log('Fetched user:', user);
          this.currentUser = user;
        } else {
          console.warn('No logged-in user found. Defaulting to guest mode.');
          this.currentUser = null;
        }
      },
      error: (err) => {
        console.error('Failed to fetch current user:', err);
        alert('Error fetching user details. Please log in again.');
      }
    });
  }

  generateUniqueId(): string {
    return Math.random().toString(36).substring(2, 8); // Generate a random 6-character ID
  }

}
