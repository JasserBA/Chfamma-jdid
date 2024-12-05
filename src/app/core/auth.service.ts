import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Post } from '../model/post';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiURL = "http://localhost:3000/posts" // JSON server URL

  constructor(private http: HttpClient) { }

  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiURL);
  }

  getPostById(id: number): Observable<Post | undefined> {
    return this.http.get<Post[]>(this.apiURL).pipe(
      map((posts: any[]) => posts.find(post => post.id === id))
    );
  }

  addPost(post: Post): Observable<Post> {
    return this.http.post<Post>(this.apiURL, post);
  }

  deleteProduitById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }



}
