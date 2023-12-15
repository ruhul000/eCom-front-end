import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {NotificationsService} from '../services/notifications.service';
import {LayoutService} from '../services/layout.service';

@Component({
    selector: 'app-processing',
    templateUrl: './processing.component.html',
    styleUrls: ['./processing.component.css']
})
export class ProcessingComponent implements OnInit {

    processing: boolean;

    constructor(public toastr: ToastsManager, vcr: ViewContainerRef, public notificationsService: NotificationsService, public layoutService: LayoutService) {
        this.toastr.setRootViewContainerRef(vcr);
        if (this.layoutService.isLogin) {
            this.notificationsService.getNotifications();
        }
        if (localStorage.getItem('message')) {
            this.toastr.success(localStorage.getItem('message'), 'Success!');
            localStorage.removeItem('message');
        }
        if (localStorage.getItem('errorMessage')) {
            this.toastr.error(localStorage.getItem('errorMessage'), 'Error!');
            localStorage.removeItem('errorMessage');
        }
        this.processing = true;
    }

    ngOnInit() {
    }

    // getPost() {
    //     //
    // }

}
