import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  
  private SERVER_URL = environment.SERVER_URL;

  /* This is to fetch all products from the backend server */
  getAllCategories() {
    const headerDict = {
      'sec-fetch-mode': 'cors',
      'sec-fetch-dest': '',
      'sec-fetch-site': 'cross-site'
    }
    
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict), 
    }
    return this.http.get('https://rcba2g0zzb.execute-api.ap-south-1.amazonaws.com/dev/v1/category-images/get', requestOptions);
  }
}
