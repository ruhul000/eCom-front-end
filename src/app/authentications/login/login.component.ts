import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {HttpService} from '../../services/http.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Constants} from '../../../config/constants';
import {LayoutService} from '../../services/layout.service';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {NotificationsService} from '../../services/notifications.service';
import {FacebookService, LoginResponse, LoginOptions} from 'ngx-facebook';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    login: FormGroup;
    register: FormGroup;
    pass: string;
    validationError: { name: boolean, email: boolean, phone: boolean, password: boolean } = {
        name: false,
        email: false,
        phone: false,
        password: false
    };

    constructor(private faceb: FacebookService, public toastr: ToastsManager, vcr: ViewContainerRef, public layoutService: LayoutService, private router: Router,
                private activatedRouter: ActivatedRoute, private httpService: HttpService, private fb: FormBuilder,
                private notificationsService: NotificationsService) {
        this.toastr.setRootViewContainerRef(vcr);
        if (this.layoutService.isLogin) {
            this.notificationsService.getNotifications();
        }
        if (localStorage.getItem('accessToken')) {
            this.router.navigate(['/']);
        }
        if (localStorage.getItem('message')) {
            this.toastr.success(localStorage.getItem('message'), 'Success!');
            localStorage.removeItem('message');
        }
        if (localStorage.getItem('errorMessage')) {
            this.toastr.error(localStorage.getItem('errorMessage'), 'Error!');
            localStorage.removeItem('errorMessage');
        }

        faceb.init({
            appId: Constants.FB_APP_ID,
            version: 'v2.9'
        });
    }

    ngOnInit() {
        this.login = this.fb.group({
            email: ['', Validators.compose([Validators.required, Validators.email])],
            password: ['', Validators.compose([Validators.required, Validators.minLength(8)])]
        });
        this.register = this.fb.group({
            name: ['', Validators.compose([Validators.required])],
            email: ['', Validators.compose([Validators.required, Validators.email])],
            phone: ['', Validators.compose([Validators.required])],
            password: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
            confirmPassword: ['']
        });
    }

    loginWithFacebook() {
        this.faceb.getLoginStatus()
            .then((resData: any) => {
                if (resData.status === 'connected') {
                    this.getProfile();
                } else {
                    this.fbLogin();
                }
            })
            .catch(console.error.bind(console));
    }

    fbLogin() {
        const loginOptions: LoginOptions = {
            enable_profile_selector: true,
            return_scopes: true,
            scope: 'public_profile,email'
        };

        this.faceb.login(loginOptions)
            .then((res: LoginResponse) => {
                if (res.status === 'connected') {
                    this.getProfile();
                } else {
                    this.toastr.error('Facebook not connected.', 'Error!');
                }

            })
            .catch(this.handleError);
    }

    //
    //
    // /**
    //  * Get the user's profile
    //  */
    getProfile() {
        this.faceb.api('/me?fields=id,name,email')
            .then((resp: any) => {
                const body = new URLSearchParams();
                body.set('email', resp.email);
                body.set('id', resp.id);
                body.set('name', resp.name);
                this.httpService.makeRequest(Constants.USER_FB_LOGIN, Constants.HTTP_POST, body, (err, respon) => {
                    if (!err && respon) {
                        if (respon.status === 200) {
                            if (this.layoutService.isLogin) {
                                this.notificationsService.getNotifications();
                            }
                            localStorage.setItem('accessToken', respon.token);
                            localStorage.setItem('message', 'Login successful.');
                            this.layoutService.isLogin = true;
                            this.layoutService.userGroup = respon.group;
                            this.layoutService.userName = respon.name;
                            this.layoutService.userEmail = respon.email;
                            if (localStorage.getItem('redirectUrl')) {
                                this.router.navigate([localStorage.getItem('redirectUrl')]);
                            } else {
                                this.router.navigate(['/']);
                            }
                            localStorage.removeItem('redirectUrl');
                        } else if (respon.status === 201) {
                            this.toastr.error(respon.message, 'Error!');
                        }
                    }
                });
            })
            .catch(this.handleError);
    }

    private handleError(error) {
        console.error('Error processing action', error);
    }

    loginSubmit() {
        if (this.login.valid) {
            const body = new URLSearchParams();
            body.set('email', this.login.value.email);
            body.set('password', this.login.value.password);
            this.httpService.makeRequest(Constants.USER_LOGIN, Constants.HTTP_POST, body, (err, res) => {
                if (!err && res) {
                    if (res.status === 200) {
                        if (this.layoutService.isLogin) {
                            this.notificationsService.getNotifications();
                        }
                        localStorage.setItem('accessToken', res.token);
                        localStorage.setItem('message', 'Login successful.');
                        this.layoutService.isLogin = true;
                        this.layoutService.userGroup = res.group;
                        this.layoutService.userName = res.name;
                        this.layoutService.userEmail = res.email;
                        if (localStorage.getItem('redirectUrl')) {
                            this.router.navigate([localStorage.getItem('redirectUrl')]);
                        } else {
                            this.router.navigate(['/']);
                        }
                        localStorage.removeItem('redirectUrl');
                    } else if (res.status === 201) {
                        this.toastr.error(res.message, 'Error!');
                    }
                }
            });
        }
    }

    registerSubmit() {
        this.validationError = {name: false, email: false, phone: false, password: false};
        if (this.register.valid && this.register.value.password === this.register.value.confirmPassword) {
            const body = new URLSearchParams();
            body.set('name', this.register.value.name);
            body.set('email', this.register.value.email);
            body.set('phone', this.register.value.phone);
            body.set('password', this.register.value.password);
            this.httpService.makeRequest(Constants.USER_REGISTER, Constants.HTTP_POST, body, (err, res) => {

                // if (!err && res) {
                if (res.status === 200) {
                    return this.toastr.success(res.message, 'Success!');
                } else if (res.status === 201) {
                    this.validationError = res.message;
                    return this.toastr.error('Validation Error', 'Error!');
                }
                // }
            });
        } else if (this.register.value.password !== this.register.value.confirmPassword) {
            this.toastr.error('Password not match.', 'Error!');
        }
    }

    passClick() {
        this.pass = this.register.value.password;
    }
}
