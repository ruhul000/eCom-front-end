import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {HttpService} from '../../services/http.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Constants} from '../../../config/constants';
import {LayoutService} from '../../services/layout.service';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {NotificationsService} from '../../services/notifications.service';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.css']
})

export class ChangePasswordComponent implements OnInit {

    changePassword: FormGroup;
    valiDationMessage: {};

    constructor(public toastr: ToastsManager, vcr: ViewContainerRef, public layoutService: LayoutService, private router: Router,
                private activatedRouter: ActivatedRoute, private httpService: HttpService, private fb: FormBuilder, public notificationsService: NotificationsService) {
        this.toastr.setRootViewContainerRef(vcr);
        if (this.layoutService.isLogin) {
            this.notificationsService.getNotifications();
        }
        if (!layoutService.isLogin) {
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
        this.valiDationMessage = {};
    }

    ngOnInit() {
        this.changePassword = this.fb.group({
            current_password: ['', Validators.compose([Validators.required])],
            new_password: ['', Validators.compose([Validators.required])],
            confirm_password: ['', Validators.compose([Validators.required])]
        });
    }

    changePasswordSubmit() {
        if (this.changePassword.valid) {
            const body = new URLSearchParams();
            body.set('current_password', this.changePassword.value.current_password);
            body.set('new_password', this.changePassword.value.new_password);
            body.set('confirm_password', this.changePassword.value.confirm_password);
            this.httpService.makeRequest(Constants.USER_URL + 'change-password', Constants.HTTP_POST, body, (err, res) => {
                if (!err && res) {
                    if (res.status === 200) {
                        this.toastr.success(res.message, 'Success!');
                    } else if (res.status === 400) {
                        this.toastr.error(res.message, 'Error!');
                    } else {
                        this.valiDationMessage = res.message;
                    }
                }
            });
        }
    }
}
