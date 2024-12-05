import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { Post } from 'src/app/model/post';

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

  constructor(private s: AuthService) { }
  ngOnInit(): void {
    this.fetchPosts();
  }

  fetchPosts(): void {
    this.s.getAllPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
        this.postsFinal = posts;
      },
      error: (err) => console.error("Failed to fetch posts")
    })
  }

  set text(value: string) {
    this.filterText = value;
    this.postsFinal = this.posts.filter(
      x => x.description.toLowerCase().includes(value));

  }
}
