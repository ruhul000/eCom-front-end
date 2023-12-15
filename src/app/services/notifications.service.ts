import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {Constants} from '../../config/constants';

@Injectable()
export class NotificationsService {

    unreadNotification: Number = 0;

    constructor(private httpService: HttpService) {
        // this.getNotifications();
    }

    getNotifications() {
        this.httpService.makeRequest(Constants.NOTIFICATIONS + 'unSeen', Constants.HTTP_GET, '', (error, response) => {
            if (error && !response) {
            } else {
                this.unreadNotification = response.data;
            }
        });
    }

    makeSeenNotifications() {
        this.httpService.makeRequest(Constants.NOTIFICATIONS + 'makeSeen', Constants.HTTP_POST, '', (error, response) => {
            if (error && !response) {
            } else {
                this.unreadNotification = 0;
            }
        });
    }

}
