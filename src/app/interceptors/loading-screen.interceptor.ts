import { Injectable } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoadingScreenService } from "../services/loading-screen/loading-screen.service";
import { TokenStorageService } from "../services/token-storage.service";
import { finalize } from "rxjs/operators";

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class LoadingScreenInterceptor implements HttpInterceptor {

  activeRequests: number = 0;

  /**
   * URLs for which the loading screen should not be enabled
   */
  skippUrls = [
    '/authrefresh',
  ];

  constructor(private loadingScreenService: LoadingScreenService, 
              private  token: TokenStorageService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let displayLoadingScreen = true;
    let authReq = request;
    request.headers.set('Content-Type','application/json;charset=utf-8');
    const token = this.token.getToken();
    if (token != null) {
        authReq = request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token)
                                });
    }
    for (const skippUrl of this.skippUrls) {
      if (new RegExp(skippUrl).test(request.url)) {
        displayLoadingScreen = false;
        break;
      }
    }

    if (displayLoadingScreen) {
      if (this.activeRequests === 0) {
        this.loadingScreenService.startLoading();
      }
      this.activeRequests++;

      return next.handle(authReq).pipe(
        finalize(() => {
          this.activeRequests--;
          if (this.activeRequests === 0) {
            this.loadingScreenService.stopLoading();
          }
        })
      )
    } else {
      return next.handle(authReq);    
    }

  };
}//end of class LoadingScreenInterceptor

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: LoadingScreenInterceptor, multi: true }
];
