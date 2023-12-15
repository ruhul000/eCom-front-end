import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../services/http.service';
import {Constants} from '../../../config/constants';
import {ToastsManager} from 'ng2-toastr';
import {NotificationsService} from '../../services/notifications.service';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

    validationError: { email: string } = {email: ''};
    formGroup: FormGroup;

    constructor(private formBuilder: FormBuilder, private httpService: HttpService, public toastr: ToastsManager, vcr: ViewContainerRef, public notificationsService: NotificationsService) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        this.formGroup = this.formBuilder.group({
            email: ['', Validators.compose([Validators.required, Validators.email])]
        });
    }

    submit() {
        this.validationError = {email: ''};
        if (this.formGroup.valid) {
            const body = new URLSearchParams();
            body.set('email', this.formGroup.value['email']);
            this.httpService.makeRequest(Constants.FORGOT_PASSWORD, Constants.HTTP_POST, body, (error, response) => {
                if (!error && response) {
                    if (response.status === 200) {
                        return this.toastr.success(response.message, 'Success');
                    } else if (response.status === 400) {
                        return this.toastr.error(response.message, 'Error');
                    } else if (response.status === 203) {
                        return this.toastr.error('Try again.', 'Error');
                    } else if (response.status === 201) {
                        return this.validationError = response.message;
                    } else {
                        return this.toastr.error('Try again.', 'Error');
                    }
                } else {
                    return this.toastr.error('Try again.', 'Error');
                }
            });
        } else {
            if (this.formGroup && this.formGroup.controls['email'] && this.formGroup.controls['email'].errors && this.formGroup.controls['email'].errors.required) {
                this.validationError['email'] = 'Email is required.';
            } else if (this.formGroup && this.formGroup.controls['email'] && this.formGroup.controls['email'].errors && this.formGroup.controls['email'].errors.email) {
                this.validationError['email'] = 'Email should be email type.';
            }
        }
    }

}
