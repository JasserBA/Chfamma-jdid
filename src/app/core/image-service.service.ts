// image.service.ts
import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiUrl = 'https://api.unsplash.com/search/photos';
  private accessKey = 'b_9P6j0Yye-PSWaV4Dx3W6A5kVUg3r7BQJ6FjOqoakk';  // Get your API key from Unsplash

  constructor() { }

  async getImageForPost(description: string): Promise<string> {
    const query = this.extractKeywords(description);
    try {
      const response = await axios.get(this.apiUrl, {
        params: { query: query, client_id: this.accessKey }
      });
      if (response.data.results.length > 0) {
        return response.data.results[0].urls.regular; // Use the first image URL
      }
      return 'default_image_url.jpg'; // Fallback image
    } catch (error) {
      console.error('Error fetching image:', error);
      return 'default_image_url.jpg'; // Fallback image
    }
  }

  private extractKeywords(description: string): string {
    // Simple example: extract the first word or keyword from the description
    // More sophisticated logic can be implemented as needed
    return description.split(' ')[0];
  }
}
