import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MessagesService } from '../services/messages.service';

@Injectable()
export class ErrorsHandler implements ErrorHandler {

    private errors = {
        'WRONG_CREDENTIALS': 'Wrong username or password',
    };

    constructor(
        private injector: Injector
    ) { }

    getMessage(code: string): string {

        if (!code || !this.errors[code]) {

            return 'Something goes wrong...';
        }

        return this.errors[code];
    }

    /**
	 * Глобальный обработчик ошибок
	 * @param error - ошибка
	 */
    handleError(error: any) {

        const messages = this.injector.get(MessagesService);

        if (error instanceof HttpErrorResponse) {
            const code = error.error.code;
            const errMsg = this.getMessage(code);
            messages.showErrorMessage(errMsg);
        } else {
            console.error(error);
        }

    }
}
