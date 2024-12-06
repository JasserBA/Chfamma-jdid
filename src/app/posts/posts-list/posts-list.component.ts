import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { Post } from 'src/app/model/post';
import { ImageService } from 'src/app/core/image-service.service';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss']
})
export class PostsListComponent implements OnInit {
  actions = [
    { icon: '../../../../assets/imgs/icons/share.svg', hoverIcon: '../../../../assets/imgs/icons/share-hovered.svg', alt: 'Share Icon', nb: '5' },
    { icon: '../../../../assets/imgs/icons/comment-hovered.svg', hoverIcon: '.../comment-hovered.svg', alt: 'Comment Icon', nb: '12' },
    { icon: '../../../../assets/imgs/icons/like.svg', hoverIcon: '../../../../assets/imgs/icons/like-hovered.svg', alt: 'Like Icon', nb: '22' }
  ];

  posts: Post[] = [];
  postsFinal: Post[] = [];
  filterText = "";

  constructor(private s: AuthService, private imageService: ImageService) { }
  ngOnInit(): void {
    this.fetchPosts();
  }

  async fetchPosts() {
    this.s.getAllPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
        this.postsFinal = posts;
      },
      error: (err) => console.error("Failed to fetch posts")
    })
    for (let post of this.postsFinal) {
      if (!post.media) {
        // Fetch dynamic image based on description if no media is provided
        post.media = await this.imageService.getImageForPost(post.description);
      }
    }
    this.posts = this.postsFinal;

  }

  set text(value: string) {
    this.filterText = value;
    this.postsFinal = this.posts.filter(
      x => x.description.toLowerCase().includes(value));

  }

  getUserInitials(fullName: string): string {
    if (!fullName) return '';

    const names = fullName.split(' ');
    const initials = names.map(name => name.charAt(0).toUpperCase());
    return initials.length > 1 ? initials[0] + initials[1] : initials[0];
  }
  onAvatarClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  onDotsClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  onReactClick(event: MouseEvent): void {
    event.stopPropagation();
  }
  onLikeClick(event: MouseEvent, post: Post): void {
    post.liked = !post.liked;
    console.log(post);
    // Toggle the liked state
    if (post.liked) {
      post.interactions.likes++; // Increment likes if liked
    } else {
      post.interactions.likes--; // Decrement likes if unliked
    }
    event.stopPropagation();

  }

}

