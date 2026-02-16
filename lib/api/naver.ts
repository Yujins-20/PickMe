// lib/api/naver.ts
// Naver Local Search API Integration

export interface NaverPlace {
  title: string;
  link: string;
  category: string;
  description: string;
  telephone: string;
  address: string;
  roadAddress: string;
  mapx: string; // longitude (경도)
  mapy: string; // latitude (위도)
}

export interface NaverSearchResult {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: NaverPlace[];
}

export class NaverSearchAPI {
  private clientId: string;
  private clientSecret: string;

  constructor(clientId?: string, clientSecret?: string) {
    this.clientId = clientId || process.env.NAVER_CLIENT_ID || '';
    this.clientSecret = clientSecret || process.env.NAVER_CLIENT_SECRET || '';
  }

  /**
   * Search local places (restaurants, cafes, etc.)
   */
  async searchLocal(query: string, display: number = 10, start: number = 1): Promise<NaverPlace[]> {
    try {
      const response = await fetch(
        `/api/naver/search?query=${encodeURIComponent(query)}&display=${display}&start=${start}`
      );

      if (!response.ok) {
        throw new Error('Naver API request failed');
      }

      const data: NaverSearchResult = await response.json();
      return data.items.map(item => ({
        ...item,
        title: this.cleanTitle(item.title),
      }));
    } catch (error) {
      console.error('Naver search error:', error);
      return [];
    }
  }

  /**
   * Search restaurants by category and location
   */
  async searchRestaurants(
    foodType: string,
    location: string = '',
    display: number = 10
  ): Promise<NaverPlace[]> {
    const query = location ? `${location} ${foodType}` : foodType;
    return this.searchLocal(query, display);
  }

  /**
   * Get places with images
   * Note: Naver Local Search API doesn't provide images directly
   * We'll need to use place URLs or implement image scraping
   */
  async getPlaceWithImage(place: NaverPlace): Promise<NaverPlace & { imageUrl?: string }> {
    // For MVP, we can use a placeholder or the place's link
    // In production, you might want to scrape the actual images
    return {
      ...place,
      imageUrl: this.getPlaceholderImage(place.category),
    };
  }

  /**
   * Clean HTML tags from title
   */
  private cleanTitle(title: string): string {
    return title.replace(/<\/?b>/g, '');
  }

  /**
   * Get placeholder image based on category
   */
  private getPlaceholderImage(category: string): string {
    const categoryMap: { [key: string]: string } = {
      '한식': 'https://images.unsplash.com/photo-1569050467447-ce54b3bbd293?w=400',
      '중식': 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400',
      '일식': 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
      '양식': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
      '카페': 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400',
      '디저트': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400',
    };

    for (const [key, url] of Object.entries(categoryMap)) {
      if (category.includes(key)) {
        return url;
      }
    }

    return 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400';
  }

  /**
   * Convert Naver coordinates to standard lat/lng
   */
  convertCoordinates(mapx: string, mapy: string): { lat: number; lng: number } {
    // Naver uses Katec coordinates, need to convert to WGS84
    // For simplicity, we'll use approximate conversion
    const lng = parseInt(mapx) / 1000000;
    const lat = parseInt(mapy) / 1000000;

    return { lat, lng };
  }
}

export default NaverSearchAPI;
