import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const API_UTILS_CONTACT_US = environment.api_url + "/api/utils/contact-us";

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private http: HttpClient) { }

  emailComment(lastName, firstName, email, comment) {
    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
        'Content-Type': 'application/json'
      })
    };

    let body = {
      last_name: lastName,
      first_name: firstName,
      email: email,
      comment: comment
    };

    return this.http.post<any>(API_UTILS_CONTACT_US, body, opts);
  }
}

