import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../services/http.service';
import {Constants} from '../../../config/constants';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastsManager} from 'ng2-toastr';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

    validationError: { email: string, newPassword: string, confirmNewPassword: string } = {
        email: '',
        newPassword: '',
        confirmNewPassword: ''
    };
    formGroup: FormGroup;
    token: string;

    constructor(private formBuilder: FormBuilder, private httpService: HttpService, private router: Router, private activatedRouter: ActivatedRoute, public toastr: ToastsManager, vcr: ViewContainerRef) {
        this.toastr.setRootViewContainerRef(vcr);
        this.activatedRouter.params.subscribe(params => {
            this.token = params.token;
        });
    }

    ngOnInit() {
        this.formValidation();
    }

    formValidation() {
        this.formGroup = this.formBuilder.group({
            email: ['', Validators.compose([Validators.required, Validators.email])],
            newPassword: ['', Validators.compose([Validators.required, Validators.min(8)])],
            confirmNewPassword: ['', Validators.compose([Validators.required, Validators.min(8)])],
        });
    }

    submit() {
        this.validationError = {email: '', newPassword: '', confirmNewPassword: ''};
        if (this.formGroup.valid) {
            const body = new URLSearchParams();
            body.set('token', this.token);
            body.set('email', this.formGroup.value['email']);
            body.set('newPassword', this.formGroup.value['newPassword']);
            body.set('confirmNewPassword', this.formGroup.value['confirmNewPassword']);
            this.httpService.makeRequest(Constants.RESET_PASSWORD, Constants.HTTP_POST, body, (error, response) => {
                if (!error && response) {
                    if (response.status === 200) {
                        setInterval(() => {
                            localStorage.setItem('message', 'Please login to continue.');
                            return this.router.navigateByUrl('/user/login');
                        }, 2000);
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
                // }
            });
        } else {
            if (this.formGroup && this.formGroup.controls['email'] && this.formGroup.controls['email'].errors && this.formGroup.controls['email'].errors.required) {
                this.validationError['email'] = 'Email is required.';
            } else if (this.formGroup && this.formGroup.controls['email'] && this.formGroup.controls['email'].errors && this.formGroup.controls['email'].errors.email) {
                this.validationError['email'] = 'Email should be email type.';
            }
            if (this.formGroup && this.formGroup.controls['newPassword'] && this.formGroup.controls['newPassword'].errors && this.formGroup.controls['newPassword'].errors.required) {
                this.validationError['newPassword'] = 'New Password is required.';
            }
            if (this.formGroup && this.formGroup.controls['confirmNewPassword'] && this.formGroup.controls['confirmNewPassword'].errors && this.formGroup.controls['confirmNewPassword'].errors.required) {
                this.validationError['confirmNewPassword'] = 'Confirm New Password is required.';
            } else {
                if (this.formGroup.value['newPassword'] !== this.formGroup.value['confirmNewPassword']) {
                    this.validationError['newPassword'] = 'New Password and Confirm New Password must be same.';
                }
            }
        }
    }

}
