import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {Constants} from '../../config/constants';
import {LayoutService} from '../services/layout.service';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {NotificationsService} from '../services/notifications.service';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

    imageURL: string;

    constructor(public toastr: ToastsManager, vcr: ViewContainerRef, public layoutService: LayoutService, public notificationsService: NotificationsService) {
        this.toastr.setRootViewContainerRef(vcr);
        if (this.layoutService.isLogin) {
            this.notificationsService.getNotifications();
        }
        this.imageURL = Constants.API_ENDPOINT;
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
    }

}
