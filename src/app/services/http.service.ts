import {Injectable} from '@angular/core';
import {Headers, Http, Response} from '@angular/http';
import {Router} from '@angular/router';
import {Constants} from '../../config/constants';
import 'rxjs/add/operator/map';

@Injectable()
export class HttpService {

    constructor(private http: Http, private router: Router) {
        //
    }

    makeRequest(url: string, method: string, body: any, callback) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        if (localStorage.getItem('accessToken')) {
          headers.append('Authorization', localStorage.getItem('accessToken'));
        }
        if (method === Constants.HTTP_GET) {
            this.http.get(url, {headers: headers}).map((res: Response) => {
                return res.json();
            }).subscribe(
                data => callback(null, data),
                err => {
                  if (err.status === 401) {
                    // this.removeTokens();
                    this.router.navigate(['/user/login']);
                  }
                },
                () => ''
            );
        } else if (method === Constants.HTTP_POST) {
            this.http.post(url, body.toString(), {headers: headers}).map((res: Response) => {
                return res.json();
            }).subscribe(
                data => callback(null, data),
                err => {
                  if (err.status === 401) {
                    // this.removeTokens();
                    this.router.navigate(['/user/login']);
                  }
                },
                () => ''
            );
        } else if (method === Constants.HTTP_PUT) {
            this.http.put(url, body, {headers: headers}).map((res: Response) => {
                return res.json();
            }).subscribe(
                data => callback(null, data),
                err => {
                  if (err.status === 401) {
                    // this.removeTokens();
                    this.router.navigate(['/user/login']);
                  }
                },
                () => ''
            );
        } else if (method === Constants.HTTP_DELETE) {
            this.http.delete(url, {headers: headers}).map((res: Response) => {
                return res.json();
            }).subscribe(
                data => callback(null, data),
                err => {
                  if (err.status === 401) {
                    // this.removeTokens();
                    this.router.navigate(['/user/login']);
                  }
                },
                () => ''
            );
        }
    }


    // removeTokens() {
    //     localStorage.removeItem('accessToken');
    // }
}
