import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { Post } from 'src/app/model/post';
import { ImageService } from 'src/app/core/image-service.service';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss']
})
export class PostsListComponent implements OnInit {
  gridType = false;
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

  constructor(private authService: AuthService, private imageService: ImageService) { }

  ngOnInit(): void {
    this.fetchPosts();
    this.fetchCurrentUser();
  }

  private fetchPosts(): void {
    this.authService.getAllPosts().subscribe({
      next: (posts) => {
        this.posts = posts.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
        this.postsFinal = [...this.posts];
        this.fetchPostMedia();
      },
      error: (err) => console.error('Failed to fetch posts:', err)
    });
  }

  private async fetchPostMedia(): Promise<void> {
    for (const post of this.postsFinal) {
      if (!post.media) {
        try {
          post.media = await this.imageService.getImageForPost(post.description);
        } catch (err) {
          console.error(`Failed to fetch media for post ID: ${post.id}`, err);
        }
      }
    }
    this.posts = [...this.postsFinal];
  }

  set text(value: string) {
    this.filterText = value.toLowerCase();
    this.postsFinal = this.posts.filter((post) =>
      post.description.toLowerCase().includes(this.filterText)
    );
  }

  get text(): string {
    return this.filterText;
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

  onGridClick(event: MouseEvent, currentGrid: string): void {
    this.gridType = currentGrid === 'grid-1' ? false : true;
    this.toggleGrid = currentGrid;
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
