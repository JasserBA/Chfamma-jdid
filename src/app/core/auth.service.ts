import { User } from '../model/user';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Post } from '../model/post';

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

  updatePostById(id: string, updatedPost: Post): Observable<void> {
    return this.http.put<void>(`${this.apiURL}/${id}`, updatedPost);
  }

}
