import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Post } from '../model/post';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private postApiURL = "http://localhost:3000/posts";
  private currentUserApiURL = "http://localhost:3000/currentuser";
  private userApiURL = "http://localhost:3000/users";
  private searchSubject = new BehaviorSubject<string>('');
  search$ = this.searchSubject.asObservable();

  constructor(private http: HttpClient) { }

  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.postApiURL);
  }

  getPostById(id: string): Observable<Post | undefined> {
    return this.http.get<Post[]>(this.postApiURL).pipe(
      map(posts => posts.find(post => post.id === id))
    );
  }

  addPost(post: Post): Observable<Post> {
    return this.http.post<Post>(this.postApiURL, post);
  }

  deletePostById(id: string): Observable<void> {
    return this.http.delete<void>(`${this.postApiURL}/${id}`);
  }

  updatePostById(id: string, updatedPost: Post): Observable<Post> {
    return this.http.put<Post>(`${this.postApiURL}/${id}`, updatedPost);
  }

  addComment(postId: string, comment: { username: string, fullname: string, description: string }): Observable<Post> {
    return this.getPostById(postId).pipe(
      map(post => {
        if (post) {
          post.comments.push(comment);
          return post;
        } else {
          throw new Error('Post not found');
        }
      }),
      switchMap(post => this.updatePostById(postId, post))
    );
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

  setSearch(value: string): void {
    this.searchSubject.next(value);
  }

  getUserInitials(fullName: string): string {
    if (!fullName) return '';
    const names = fullName.split(' ');
    const initials = names.map(name => name.charAt(0).toUpperCase());
    return initials.slice(0, 2).join('');
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.userApiURL);
  }

  // verifyLogin(credentials: { username: string, password: string }): Observable<any> {
  //   return this.http.post<any>(`${this.userApiURL}`, credentials);
  // }

  loginCurrentUser(loginUsername: string, loginFullname: string): Observable<User | null> {
    return this.http.put<User | null>(`${this.currentUserApiURL}`, {
      username: loginUsername,
      fullname: loginFullname
    });
  }
}
