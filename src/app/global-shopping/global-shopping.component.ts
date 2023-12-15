import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {HttpService} from '../services/http.service';
import {Constants} from '../../config/constants';
import {Router} from '@angular/router';
import {Slider} from '../../models/Slider';
import {LayoutService} from '../services/layout.service';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {SettingsService} from '../services/settings.service';
import {NotificationsService} from '../services/notifications.service';

@Component({
    selector: 'app-global-shopping',
    templateUrl: './global-shopping.component.html',
    styleUrls: ['./global-shopping.component.css']
})

export class GlobalShoppingComponent implements OnInit {

    requestProduct: FormGroup;
    sliders: Slider[] = [];
    imageURL: string;
    checkoutValidation: {
        name: boolean, url: boolean, quantity: boolean
    } = {name: false, url: false, quantity: false};

    constructor(public toastr: ToastsManager, vcr: ViewContainerRef, public layoutService: LayoutService, private fb: FormBuilder, private httpService: HttpService, private router: Router, public notificationsService: NotificationsService, public settingsService: SettingsService) {
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
        this.imageURL = Constants.API_ENDPOINT;
    }

    ngOnInit() {
        this.getSliders();
        this.requestProduct = this.fb.group({
            name: ['', Validators.compose([Validators.required])],
            brand: ['Amazon', Validators.compose([Validators.required])],
            url: ['', Validators.compose([Validators.required])],
            quantity: ['', Validators.compose([Validators.required])],
            notes: ['']
        });
        this.getSettings();
    }

    getSettings() {
        this.httpService.makeRequest(Constants.SITES, Constants.HTTP_GET, {}, (err, res) => {
            this.settingsService = res.data;
        });
    }

    goToLogin() {
        localStorage.setItem('redirectUrl', '/global_shopping');
        this.router.navigate(['/user/login']);
    }

    getSliders() {
        this.httpService.makeRequest(Constants.GLOBAL_SLIDER_ALL, Constants.HTTP_GET, {}, (err, res) => {
            if (!err && res) {
                if (res.status === 404 || res.status === 500) {
                    this.toastr.error(res.messages, 'Error!');
                } else {
                    this.sliders = res.data;
                }
            }
        });
    }

    requestProductSubmit() {
        this.checkoutValidation = {name: false, url: false, quantity: false};
        if (this.requestProduct.valid) {
            const body = new URLSearchParams();
            if (this.requestProduct.value.name) {
                body.set('name', this.requestProduct.value.name);
            }
            if (this.requestProduct.value.notes) {
                body.set('notes', this.requestProduct.value.notes);
            }
            body.set('brand', this.requestProduct.value.brand);
            body.set('url', this.requestProduct.value.url);
            body.set('quantity', this.requestProduct.value.quantity);
            this.httpService.makeRequest(Constants.REQUEST, Constants.HTTP_POST, body, (err, res) => {
                if (!err && res.status === 200) {
                    this.toastr.success(res.message, 'Success!');
                    this.httpService.makeRequest(Constants.NOTIFICATIONS + 'create', Constants.HTTP_POST, {}, (error, response) => {
                        if (!error && response.status === 200) {
                            this.toastr.success(response.message, 'Success');
                            setTimeout(() => {
                                return this.router.navigate(['/request/all']);
                            }, 2000);
                        }
                    });

                } else {
                    this.toastr.error(res.message, 'Error!');
                }
            });

        } else {
            if (this.requestProduct && this.requestProduct.controls['name'] && this.requestProduct.controls['name'].invalid) {
                this.checkoutValidation.name = true;
                this.toastr.error('Product Name is required.', 'Error!');
            }
            if (this.requestProduct && this.requestProduct.controls['url'] && this.requestProduct.controls['url'].invalid) {
                this.checkoutValidation.url = true;
                this.toastr.error('URL is required.', 'Error!');
            }
            if (this.requestProduct && this.requestProduct.controls['quantity'] && this.requestProduct.controls['quantity'].invalid) {
                this.checkoutValidation.quantity = true;
                this.toastr.error('Quantity is required.', 'Error!');
            }
        }
    }
}
