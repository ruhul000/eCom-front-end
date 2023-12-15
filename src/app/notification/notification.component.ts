import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {HttpService} from '../services/http.service';
import {Constants} from '../../config/constants';
import {User} from '../../models/User';
import {LayoutService} from '../services/layout.service';
import {Order} from '../../models/Order';
import {Router} from '@angular/router';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {Observable} from 'rxjs/Observable';
import {NotificationsService} from '../services/notifications.service';

@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

    notifications: { sender: User, receiver: User, message: string, createdAt: string, subject: string, orderId: Order }[] = [];
    maxSize: number;
    itemsPerPage: number;
    totalItems: number;
    bigCurrentPage: number;
    numPages: number;

    constructor(public toastr: ToastsManager, vcr: ViewContainerRef, private httpService: HttpService,
                private router: Router, public layoutService: LayoutService, public notificationsService: NotificationsService) {
        this.toastr.setRootViewContainerRef(vcr);
        if (this.layoutService.isLogin) {
            this.notificationsService.getNotifications();
        }
        this.notificationsService.makeSeenNotifications();
        this.maxSize = 5;
        this.itemsPerPage = 10;
        this.totalItems = 0;
        this.bigCurrentPage = 1;
        this.numPages = 0;
        if (!this.layoutService.isLogin) {
            this.router.navigate(['/user/login']);
        }
        if (localStorage.getItem('message')) {
            this.toastr.success(localStorage.getItem('message'), 'Success!');
            localStorage.removeItem('message');
        }
        if (localStorage.getItem('errorMessage')) {
            this.toastr.error(localStorage.getItem('errorMessage'), 'Error!');
            localStorage.removeItem('errorMessage');
        }
    }

    ngOnInit() {
        this.getNotifications(this.bigCurrentPage, this.itemsPerPage);
        Observable.interval(5000).subscribe(() => {
            if (this.layoutService.isLogin) {
                this.getNotifications(this.bigCurrentPage, this.itemsPerPage);
            }
        });
    }

    pageChanged(event: any): void {
        this.getNotifications(event.page, this.itemsPerPage);
    }

    getNotifications(page, limit) {
        const body = new URLSearchParams();
        body.set('page', page);
        body.set('limit', limit);
        this.httpService.makeRequest(Constants.NOTIFICATIONS + 'my', Constants.HTTP_POST, body, (err, res) => {
            if (!err && res) {
                if (res.status === 404 || res.status === 500) {
                    this.toastr.error(res.messages, 'Error!');
                } else {
                    this.notifications = res.data;
                    this.totalItems = res.total;
                }
            }
        });
    }

}
