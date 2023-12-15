import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Constants} from '../../../config/constants';
import {User} from '../../../models/User';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Division} from '../../../models/Division';
import {District} from '../../../models/District';
import {LayoutService} from '../../services/layout.service';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {NotificationsService} from '../../services/notifications.service';

@Component({
    selector: 'app-my-account',
    templateUrl: './my-account.component.html',
    styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {

    userPersonalFormGroup: FormGroup;
    validationError: {};
    user: User = new User();
    divisions: Division[] = [];
    districts: District[] = [];
    showDistricts: District[] = [];

    constructor(public toastr: ToastsManager, vcr: ViewContainerRef, public layoutService: LayoutService, private router: Router, private activatedRouter: ActivatedRoute, private httpService: HttpService, private formBuilder: FormBuilder, public notificationsService: NotificationsService) {
        this.toastr.setRootViewContainerRef(vcr);
        if (this.layoutService.isLogin) {
            this.notificationsService.getNotifications();
        }
        this.getProfile();
        this.getDivisions();
        this.getDistricts();
        this.validationError = {};

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
        this.userPersonalFormGroup = this.formBuilder.group({
            name: ['', Validators.compose([Validators.required])],
            email: ['', Validators.compose([Validators.required, Validators.email])],
            phone: ['', Validators.compose([Validators.required])],
            division: ['', Validators.compose([Validators.required])],
            district: ['', Validators.compose([Validators.required])],
            address_1: ['', Validators.compose([Validators.required])],
            address_2: [''],
            zip: ['', Validators.compose([Validators.required])],
            shippingEmail: [''],
            shippingPhone: [''],
        });

    }

    getProfile() {
        this.httpService.makeRequest(Constants.PROFILE, Constants.HTTP_GET, {}, (err, res) => {
            if (res.status === 400) {
                localStorage.setItem('errorMessage', 'Sorry you are logged out.');
                this.router.navigate(['/logout']);
            } else {
                this.user = res.message;
                if (this.user && this.user.division && this.user.division._id) {
                    this.getDistrictsByDivision(this.user.division._id);
                }
            }
        });
    }

    getDivisions() {
        this.httpService.makeRequest(Constants.GET_DIVISIONS, Constants.HTTP_GET, {}, (error, success) => {
            if (!error && success) {
                if (success.status === 200) {
                    this.divisions = success.data;
                    if (this.user && this.user.division && this.user.division._id) {
                        this.getDistrictsByDivision(this.user.division._id);
                    }
                } else {
                    this.toastr.error('Please try again.', 'Error!');
                }
            } else {
                this.toastr.error('Please try again.', 'Error!');
            }
        });
    }

    getDistricts() {
        this.httpService.makeRequest(Constants.GET_DISTRICTS, Constants.HTTP_GET, {}, (err, res) => {
            if (!err && res) {
                if (res.status === 404 || res.status === 500) {
                    this.toastr.error(res.messages, 'Error!');
                } else {
                    this.districts = res.message;
                }
            }
        });
    }

    getDistrictsByDivision(event) {
        this.showDistricts = [];
        for (let i = 0; i < this.districts.length; i++) {
            if (this.districts[i].division_id._id === event) {
                this.showDistricts.push(this.districts[i]);
            }
        }
    }


    userPersonalFormSubmit() {
        if (this.userPersonalFormGroup.valid) {
            const body = new URLSearchParams();
            body.set('name', this.userPersonalFormGroup.value['name']);
            body.set('email', this.userPersonalFormGroup.value['email']);
            body.set('phone', this.userPersonalFormGroup.value['phone']);
            body.set('division', this.userPersonalFormGroup.value['division']);
            body.set('district', this.userPersonalFormGroup.value['district']);
            body.set('address_1', this.userPersonalFormGroup.value['address_1']);
            body.set('address_2', this.userPersonalFormGroup.value['address_2']);
            body.set('zip', this.userPersonalFormGroup.value['zip']);
            body.set('shippingEmail', this.userPersonalFormGroup.value['shippingEmail']);
            body.set('shippingPhone', this.userPersonalFormGroup.value['shippingPhone']);
            this.httpService.makeRequest(Constants.PROFILE_UPDATE, Constants.HTTP_POST, body, (err, res) => {
                if (res.status === 200) {
                    this.toastr.success('Updated successfully.', 'Success!');
                } else if (res.status === 205) {
                    this.toastr.error(res.message, 'Error!');
                }
            });
        }
    }

}
