import { Component, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';
import { Post } from 'src/app/model/post';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.scss']
})
export class PostDetailsComponent {
  post!: Post;
  posts: Post[] = [];
  postsFinal: Post[] = [];
  filterText = '';
  currentUser: { username: string; fullname: string } | null = null;
  initials = this.authService.getUserInitials;
  dropdownVisible: boolean = false;
  toggleGrid: string = "grid-1";
  actions = [
    { icon: 'assets/imgs/icons/share.svg', hoverIcon: 'assets/imgs/icons/share-hovered.svg', alt: 'Share Icon', nb: '5' },
    { icon: 'assets/imgs/icons/comment.svg', hoverIcon: 'assets/imgs/icons/comment-hovered.svg', alt: 'Comment Icon', nb: '12' },
    { icon: 'assets/imgs/icons/like.svg', hoverIcon: 'assets/imgs/icons/like-hovered.svg', alt: 'Like Icon', nb: '22' }
  ];
  constructor(private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id']; // No need to convert to a number
    this.authService.getPostById(id).subscribe({
      next: (post) => {
        if (post) {
          this.post = post;
          console.log(this.post);
        } else {
          console.error(`Product with ID ${id} not found.`);
        }
      },
      error: (err) => {
        console.error(`Failed to fetch product with ID ${id}:`, err);
      }
    });
    this.fetchCurrentUser();

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

  onPreventClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  onLikeClick(event: MouseEvent, post: Post): void {
    post.liked = !post.liked;
    post.interactions.likes += post.liked ? 1 : -1;

    this.authService.updatePostById(post.id, post).subscribe({
      next: () => console.log('Post updated successfully'),
      error: (err) => console.error('Error updating post:', err)
    });

    event.stopPropagation();
  }

  private fetchCurrentUser(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => (this.currentUser = user || null),
      error: (err) => console.error('Failed to fetch current user:', err)
    });
  }

  deletePost(event: MouseEvent, postId: string): void {
    const currentUsername = this.currentUser?.username || 'GuestUser';
    const post = this.posts.find((p) => p.id === postId);

    if (post && currentUsername === post.username && confirm('Are you sure you want to delete this post?')) {
      this.authService.deletePostById(postId).subscribe({
        next: () => {
          this.fetchPosts();
          alert('Post deleted successfully!');
        },
        error: (err) => {
          console.error('Failed to delete post:', err);
          alert('Error deleting post. Please try again.');
        }
      });
    }

    event.stopPropagation();
  }

  toggleDropdown(event: Event, postId: string) {
    event.stopPropagation();
    this.posts.forEach(p => p.dropdownVisible = p.id === postId ? !p.dropdownVisible : false);
  }

  @HostListener('document:click')
  closeDropdown(): void {
    this.posts.forEach(p => p.dropdownVisible = false);
  }

  copyPostURL(event: Event, postId: string, post: Post) {
    event.stopPropagation();

    if (post.shared) {
      alert('URL already copied!');
      this.posts.forEach(p => p.dropdownVisible = false);
      return;
    }

    const postUrl = `${window.location.origin}/details/${postId}`;
    navigator.clipboard.writeText(postUrl).then(() => {
      alert('URL copied! ' + postUrl);

      post.shared = true;
      post.interactions.shares += 1;

      this.authService.updatePostURLById(postId, post).subscribe({
        next: () => console.log('Shared updated successfully'),
        error: (err) => console.error('Error updating post:', err)
      });
    }).catch(err => {
      console.error('FAILED copy URL:', err);
    });

    this.posts.forEach(p => p.dropdownVisible = false);
  }

}
