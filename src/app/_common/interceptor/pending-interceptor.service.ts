import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';

import { catchError, finalize, map } from 'rxjs/operators';

import { SpinnerService } from '../services/spinner.service';
import { Observable } from 'rxjs';

@Injectable()
export class PendingInterceptor implements HttpInterceptor {

    constructor(
        private spinner: SpinnerService
    ) { }

    /**
	 * Список игнорируемых url, для которых не надо показывать спиннер
	 */
    get ignoredUrls(): string[] {
        return [

        ];
    }

    /**
	 * Проверка является ли url ингорируемым
	 * @param url - url ресурса
	 */
    private isIgnored(url: string): boolean {
        return this.ignoredUrls.some((ignoredUrl) => url.includes(ignoredUrl));
    }

    /**
	 * Перехват всех запросов для показа спиннера
	 */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (!this.isIgnored(req.url)) {
            this.spinner.inc();
        }

        return next.handle(req).pipe(
            map(event => {
                return event;
            }),
            catchError(error => {
                return Observable.throw(error);
            }),
            finalize(() => {
                if (!this.isIgnored(req.url)) {
                    this.spinner.dec();
                }
            })
        );
    }
}

