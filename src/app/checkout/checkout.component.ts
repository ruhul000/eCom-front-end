import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {Constants} from '../../config/constants';
import {HttpService} from '../services/http.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LayoutService} from '../services/layout.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {District} from '../../models/District';
import {Division} from '../../models/Division';
import {User} from '../../models/User';
import {Cart} from '../../models/cart';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {Http, Response, URLSearchParams} from '@angular/http';
import {NotificationsService} from '../services/notifications.service';

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

    shippingFormGroup: FormGroup;
    cart: Cart[] = [];
    user: User = new User();
    imageURL = Constants.API_ENDPOINT;
    divisions: Division[] = [];
    districts: District[] = [];
    showDistricts: District[] = [];
    estimatedDate: {
        startDate: any,
        endDate: any,
    } = {startDate: '', endDate: ''};
    checkoutValidation: {
        division: boolean, district: boolean, address_1: boolean, zip: boolean, shippingPhone: boolean
    } = {division: false, district: false, address_1: false, zip: false, shippingPhone: false};

    constructor(private http: Http, public toastr: ToastsManager, vcr: ViewContainerRef, private formBuilder: FormBuilder, private router: Router, private activatedRouter: ActivatedRoute, private httpService: HttpService, public layoutService: LayoutService, public notificationsService: NotificationsService) {
        this.toastr.setRootViewContainerRef(vcr);
        if (this.layoutService.isLogin) {
            this.notificationsService.getNotifications();
        }
        if (localStorage.getItem('cart')) {
            this.cart = JSON.parse(localStorage.getItem('cart'));
        }
        this.estimatedDate.startDate = new Date(new Date().setDate(new Date().getDate() + 4));
        this.estimatedDate.endDate = new Date(new Date().setDate(new Date().getDate() + 7));
        this.getProfile();
        this.getDivisions();
        this.getDistricts();
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
        this.shippingFormGroup = this.formBuilder.group({
            division: ['', Validators.compose([Validators.required])],
            district: ['', Validators.compose([Validators.required])],
            address_1: ['', Validators.compose([Validators.required])],
            address_2: [''],
            zip: ['', Validators.compose([Validators.required])],
            shippingEmail: [''],
            shippingPhone: ['', Validators.compose([Validators.required])],
            paymentType: ['', Validators.compose([Validators.required])]
        });

    }

    getProfile() {
        if (this.layoutService.isLogin) {
            this.httpService.makeRequest(Constants.PROFILE, Constants.HTTP_GET, {}, (err, res) => {
                if ((res.status === 400) || (res.status === 401)) {
                } else {
                    this.user = res.message;
                    if (this.user && this.user.division && this.user.division._id) {
                        this.getDistrictsByDivision(this.user.division._id);
                    }

                }
            });
        }
    }

    getDivisions() {
        this.httpService.makeRequest(Constants.GET_DIVISIONS, Constants.HTTP_GET, {}, (error, success) => {
            if (!error && success.status === 200) {
                this.divisions = success.data;
                if (this.user && this.user.division && this.user.division._id) {
                    this.getDistrictsByDivision(this.user.division._id);
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

    goToLogin() {
        localStorage.setItem('redirectUrl', '/order/checkout');
        this.router.navigate(['/user/login']);
    }

    makePayment() {
        this.checkoutValidation = {
            division: false,
            district: false,
            address_1: false,
            zip: false,
            shippingPhone: false
        };
        if (this.layoutService.isLogin && this.shippingFormGroup.valid) {
            const body = new URLSearchParams();
            body.set('division', this.shippingFormGroup.value['division']);
            body.set('district', this.shippingFormGroup.value['district']);
            body.set('address_1', this.shippingFormGroup.value['address_1']);
            body.set('address_2', this.shippingFormGroup.value['address_2']);
            body.set('zip', this.shippingFormGroup.value['zip']);
            body.set('shippingEmail', this.shippingFormGroup.value['shippingEmail']);
            body.set('shippingPhone', this.shippingFormGroup.value['shippingPhone']);
            body.set('paymentType', this.shippingFormGroup.value['paymentType']);
            body.set('order_type', 'Local');
            body.set('products', localStorage.getItem('cart'));
            body.set('subtotal', localStorage.getItem('total_price'));
            body.set('discount', localStorage.getItem('total_discount'));
            body.set('shippingPrice', localStorage.getItem('total_shippingPrice'));
            body.set('total', localStorage.getItem('grand_total'));
            this.httpService.makeRequest(Constants.ORDER_POST, Constants.HTTP_POST, body, (err, res) => {
                if (!err && res) {
                    if (res.status === 404 || res.status === 500) {
                        this.toastr.error(res.messages, 'Error!');
                    } else {
                        if (this.shippingFormGroup.value['paymentType'] === 'On Delivery') {
                            localStorage.removeItem('cart');
                            localStorage.removeItem('total_price');
                            localStorage.removeItem('total_discount');
                            localStorage.removeItem('total_shippingPrice');
                            localStorage.removeItem('grand_total');
                            this.layoutService.cart = [];
                            this.layoutService.total_price = 0;
                            this.layoutService.total_shippingPrice = 0;
                            this.layoutService.total_discount = 0;
                            this.layoutService.grand_total = 0;
                            localStorage.setItem('message', 'Product purchased successfully.');
                            if (localStorage.getItem('redirectUrl')) {
                                this.router.navigate([localStorage.getItem('redirectUrl')]);
                            } else {
                                this.router.navigate(['/order/all']);
                            }

                            localStorage.removeItem('redirectUrl');
                        } else {

                            this.http.get('https://epay.walletmix.com/check-server', {}).subscribe((responsedata: Response) => {
                                const response = responsedata.json();
                                const body2 = new URLSearchParams();
                                body2.set('wmx_id', Constants.wmx_id);
                                body2.set('merchant_order_id', res.data._id);
                                body2.set('merchant_ref_id', res.data.order_id);
                                body2.set('app_name', Constants.app_name);
                                body2.set('cart_info', Constants.cart_info);
                                body2.set('customer_name', this.user.name);
                                body2.set('customer_email', this.user.email);
                                body2.set('customer_add', this.shippingFormGroup.value['address_1']);
                                body2.set('customer_phone', this.shippingFormGroup.value['shippingPhone']);
                                let product_desc = '';
                                for (const cartdata of this.cart) {
                                    product_desc += '{' + cartdata.qty + ' X ' + cartdata.name + ' [' + (cartdata.discount ? (cartdata.price - (cartdata.price * cartdata.discount / 100)) : cartdata.price) + ']=[' + (cartdata.discount ? cartdata.qty * (cartdata.price - (cartdata.price * cartdata.discount / 100)) : cartdata.qty * cartdata.price) + ']' + '} ';
                                }
                                product_desc += '{shipping rate:' + localStorage.getItem('total_shippingPrice') + '}-{discount amount:' + localStorage.getItem('total_discount') + '}=' + this.layoutService.grand_total;
                                body2.set('product_desc', product_desc);
                                body2.set('amount', this.layoutService.grand_total.toString());

                                body2.set('currency', Constants.currency);
                                body2.set('options', Constants.option);
                                body2.set('callback_url', Constants.callback_url + res.data._id);
                                body2.set('access_app_key', Constants.access_app_key);
                                body2.set('authorization', Constants.authorization);
                                this.http.post(response.url, body2, {}).subscribe((response1data: Response) => {
                                    const response1 = response1data.json();
                                    window.location.href = response.bank_payment_url + '/' + response1.token;
                                });
                            });
                        }
                    }
                }
            });

        } else {
            if (this.shippingFormGroup && this.shippingFormGroup.controls['division'] && this.shippingFormGroup.controls['division'].invalid) {
                this.checkoutValidation.division = true;
                this.toastr.error('Shipping division is required.', 'Error!');
            }
            if (this.shippingFormGroup && this.shippingFormGroup.controls['district'] && this.shippingFormGroup.controls['district'].invalid) {
                this.checkoutValidation.district = true;
                this.toastr.error('Shipping district is required.', 'Error!');
            }
            if (this.shippingFormGroup && this.shippingFormGroup.controls['address_1'] && this.shippingFormGroup.controls['address_1'].invalid) {
                this.checkoutValidation.address_1 = true;
                this.toastr.error('Shipping address 1 is required', 'Error!');
            }
            if (this.shippingFormGroup && this.shippingFormGroup.controls['zip'] && this.shippingFormGroup.controls['zip'].invalid) {
                this.checkoutValidation.zip = true;
                this.toastr.error('Shipping zip is required.', 'Error!');
            }
            if (this.shippingFormGroup && this.shippingFormGroup.controls['shippingPhone'] && this.shippingFormGroup.controls['shippingPhone'].invalid) {
                this.checkoutValidation.shippingPhone = true;
                this.toastr.error('Shipping Phone is required.', 'Error!');
            }
        }
    }
}
