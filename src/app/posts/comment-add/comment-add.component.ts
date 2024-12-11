import { Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';
import { Post } from 'src/app/model/post';

@Component({
  selector: 'app-comment-add',
  templateUrl: './comment-add.component.html',
  styleUrls: ['./comment-add.component.scss']
})
export class CommentAddComponent implements OnInit {
  @Input() postId!: string;
  myForm!: FormGroup;
  post!: Post; // Change from Post[] to Post
  posts: Post[] = [];
  postsFinal: Post[] = [];
  currentUser: { username: string; fullname: string } | null = null;
  initials = this.authService.getUserInitials;

  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService) { }

  ngOnInit(): void {
    this.initializeForm();
    this.fetchCurrentUser();
    this.fetchPosts();
    this.authService.getPostById(this.postId).subscribe({
      next: (post) => {
        if (post) {
          this.post = post; // Assign the fetched post to the post variable
          console.log(this.post);
        } else {
          console.error(`Post with ID ${this.postId} not found.`);
        }
      },
      error: (err) => {
        console.error(`Failed to fetch post with ID ${this.postId}:`, err);
      }
    });
  }

  private fetchPosts(): void {
    this.authService.getAllPosts().subscribe({
      next: (posts) => {
        this.posts = posts.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
        this.postsFinal = [...this.posts];
      },
      error: (err) => console.error('Failed to fetch posts:', err)
    });
  }

  private fetchCurrentUser(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => (this.currentUser = user || null),
      error: (err) => {
        console.error('Failed to fetch current user:', err);
        alert('Error fetching user details. Please log in again.');
      },
    });
  }

  private initializeForm(): void {
    this.myForm = this.fb.group({
      description: [null, [Validators.required]],
      image: [null],
    });
  }

  async addComment(postId: string): Promise<void> {
    if (this.myForm.invalid) {
      alert('Please fill in the required fields.');
      return;
    }


    const newComment = {
      username: this.currentUser?.username || 'GuestUser',
      fullname: this.currentUser?.fullname || 'GuestUser',
      description: this.myForm.value.description,
    };

    this.authService.addComment(postId, newComment).subscribe({
      next: (updatedPost) => {
        this.posts = this.posts.map((post) =>
          post.id === updatedPost.id ? updatedPost : post
        );
        //this.fetchComment();
        this.router.navigate([`/details/${this.postId}`]).then(() => window.location.reload());

        this.myForm.reset();
      },
      error: (err) => {
        console.error('Failed to add comment:', err);
        alert('Error adding comment. Please try again.');
      },
    });
  }

  resizeTextarea(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  toggleDropdown(event: Event, postId: string) {
    event.stopPropagation();
    this.posts.forEach(p => p.dropdownVisible = p.id === postId ? !p.dropdownVisible : false);
  }

  @HostListener('document:click')
  closeDropdown(): void {
    this.posts.forEach(p => p.dropdownVisible = false);
  }
}
