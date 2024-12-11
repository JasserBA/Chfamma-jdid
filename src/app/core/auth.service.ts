import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Post } from '../model/post';
import { User } from '../model/user';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiURL = "http://localhost:3000/posts";
  private currentUserApiURL = "http://localhost:3000/currentuser";

  constructor(private http: HttpClient) { }

  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiURL);
  }

  getPostById(id: string): Observable<Post | undefined> {
    return this.http.get<Post[]>(this.apiURL).pipe(
      map(posts => posts.find(post => post.id === id))
    );
  }

  addPost(post: Post): Observable<Post> {
    return this.http.post<Post>(this.apiURL, post);
  }

  deletePostById(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }

  getCurrentUser(): Observable<User | null> {
    return this.http.get<User>(this.currentUserApiURL).pipe(
      map(user => user || null)
    );
  }

  logOutCurrentUser(): Observable<User | null> {
    return this.http.put<User | null>(`${this.currentUserApiURL}`, {
      username: null,
      fullname: null
    });
  }

  getUserInitials(fullName: string): string {
    if (!fullName) return '';
    const names = fullName.split(' ');
    const initials = names.map(name => name.charAt(0).toUpperCase());
    return initials.slice(0, 2).join('');
  }

  updatePostById(id: string, updatedPost: Post): Observable<Post> {
    return this.http.put<Post>(`${this.apiURL}/${id}`, updatedPost);
  }

  addComment(postId: string, comment: { username: string, fullname: string, description: string }): Observable<Post> {
    return this.getPostById(postId).pipe(
      map(post => {
        if (post) {
          post.comments.push(comment); // Add the new comment
          return post;
        } else {
          throw new Error('Post not found');
        }
      }),
      switchMap(post => this.updatePostById(postId, post)) // Update the post with the new comment
    );
  }
}
