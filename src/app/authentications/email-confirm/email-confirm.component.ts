import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {ToastsManager} from 'ng2-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpService} from '../../services/http.service';
import {Constants} from '../../../config/constants';
import {NotificationsService} from '../../services/notifications.service';

@Component({
    selector: 'app-email-confirm',
    templateUrl: './email-confirm.component.html',
    styleUrls: ['./email-confirm.component.css']
})
export class EmailConfirmComponent implements OnInit {

    token: string;

    constructor(public toastr: ToastsManager, vcr: ViewContainerRef, private router: Router, private activatedRouter: ActivatedRoute, private httpService: HttpService, public notificationsService: NotificationsService) {
        this.activatedRouter.params.subscribe(params => {
            this.token = params.token;
        });
    }

    ngOnInit() {
        this.checkToken();
    }

    checkToken() {
        const body = new URLSearchParams();
        body.set('token', this.token);
        this.httpService.makeRequest(Constants.EMAIL_VALIDATION, Constants.HTTP_POST, body, (error, response) => {
            if (!error && response.status === 200) {
                // noinspection JSIgnoredPromiseFromCall
                this.tokenValid();
                setInterval(() => {
                    localStorage.setItem('message', 'Please login to continue.');
                    return this.router.navigateByUrl('/user/login');
                }, 2000);
            } else {
                // noinspection JSIgnoredPromiseFromCall
                this.tokenInValid();
            }
        });
    }

    tokenValid() {
        return this.toastr.success('Your email is validate. Please wait for a while', 'Success');
    }

    tokenInValid() {
        return this.toastr.error('Your email is invalidate. Please wait for a while', 'Error');
    }

}
