
import { Injectable, NgZone } from '@angular/core';

import { MatSnackBar } from '@angular/material';

@Injectable()
export class NotificationsService {

    constructor(
        private snackBar: MatSnackBar,
        private zone: NgZone
    ) { }

    /**
	 * Обертка над методом snackBar.open() для избежание ошибок с zone
	 * @param text - текст сообщения
	 * @param isError - красная плашка или нет
	 */
    private openSnackBar(text: string, isError?: boolean): void {
        this.zone.run(() => {

            const conf = {
                duration: 3000,
                panelClass: ''
            };

            if (isError) {
                conf.panelClass = 'error-message';
            }

            const snackBar = this.snackBar.open(text, null, conf);

            snackBar.onAction().subscribe(() => {
                snackBar.dismiss();
            });
        });
    }

    /**
	 * Показ сообщения
	 * @param message - текст сообщения
	 */
    showMessage(message: string): void {
        this.openSnackBar(message);
    }

    /**
	 * Показ сообщения об ошибке
	 * @param message - текст сообщения об ошибке
	 */
    showErrorMessage(message: string): void {
        this.openSnackBar(message, true);
    }


}
