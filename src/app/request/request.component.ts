import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {HttpService} from '../services/http.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Constants} from '../../config/constants';
import {LayoutService} from '../services/layout.service';
import {Request} from '../../models/Request';
import {SettingsService} from '../services/settings.service';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {NotificationsService} from '../services/notifications.service';
import {Observable} from 'rxjs/Observable';

@Component({
    selector: 'app-request',
    templateUrl: './request.component.html',
    styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {
    checkModalOpen: boolean;
    requests: Request[] = [];
    maxSize: number;
    itemsPerPage: number;
    totalItems: number;
    bigCurrentPage: number;
    numPages: number;
    imageURL = Constants.API_ENDPOINT;
    notificationModal: { showModal: boolean, receiverUsername: string, receiverUserId: string, message: string, id: string, showRequestNotification: boolean, showRequestNotificationDetail: { message: string, createdAt: string, subject: string }[] } = {
        showModal: false,
        receiverUsername: '',
        receiverUserId: '',
        message: '',
        id: '',
        showRequestNotification: false,
        showRequestNotificationDetail: []
    };
    addCartModal: { showModal: boolean, requestId: string, name: string, detail: string, picture: string, pictureMimeType: string, price: number, quantity: number, service: number, tax: number, taxType: string, shipping: { toBeDeclared: boolean, price: number }, total: number } = {
        showModal: false,
        requestId: '',
        name: '',
        detail: '',
        picture: '',
        pictureMimeType: '',
        price: 0,
        quantity: 1,
        service: 0,
        tax: 0,
        taxType: '%',
        shipping: {toBeDeclared: true, price: 0},
        total: 0
    };
    pagination: { limit: number, page: number, next: boolean } = {limit: 20, page: 1, next: true};
    showProductDetailModal: { showModal: boolean, request: Request } = {showModal: false, request: new Request()};
    minDate: Date = new Date();
    showDate: Date = new Date();
    outTime: Date = new Date();
    validDate: boolean;
    showProceed: {
        button: boolean,
        expiredTime: Date
    } = {button: true, expiredTime: new Date()};
    total: { original: number, round: number } = {original: 0, round: 0};

    constructor(public toastr: ToastsManager, vcr: ViewContainerRef, public layoutService: LayoutService, private router: Router, private activatedRouter: ActivatedRoute, private httpService: HttpService, public settingsService: SettingsService, public notificationsService: NotificationsService) {
        this.toastr.setRootViewContainerRef(vcr);
        if (this.layoutService.isLogin) {
            this.notificationsService.getNotifications();
        }
        this.showDate = new Date(this.showDate.setDate(this.minDate.getDate() + 2));
        console.log(this.showDate);
        this.checkModalOpen = false;
        this.validDate = true;
        this.outTime = this.showDate;
        this.maxSize = 5;
        this.itemsPerPage = 10;
        this.totalItems = 0;
        this.bigCurrentPage = 1;
        this.numPages = 0;
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
    }

    ngOnInit() {
        this.getRequests(this.bigCurrentPage, this.itemsPerPage);
        Observable.interval(5000).subscribe(() => {
            console.log(this.checkModalOpen);
            if (this.layoutService.isLogin && !this.checkModalOpen) {
                this.getRequests(this.bigCurrentPage, this.itemsPerPage);
            }
        });
    }

    convertTotal() {
        const total = (this.addCartModal.price * this.settingsService.dollarRate * this.addCartModal.quantity) + ((this.addCartModal.price * this.settingsService.dollarRate * this.addCartModal.quantity * this.addCartModal.service) / 100) + (this.addCartModal.taxType === '%' ? ((this.addCartModal.price * this.settingsService.dollarRate * this.addCartModal.quantity * this.addCartModal.tax) / 100) : this.addCartModal.tax) + this.addCartModal.shipping.price;
        this.total.original = total;
        const round1 = Math.ceil(total);
        if (round1 % 5 !== 0) {
            this.total.round = (5 - (round1 % 5)) + round1;
        } else {
            this.total.round = round1;
        }
    }

    timeChange(event) {
        if (event !== null) {
            this.validDate = true;
            this.outTime = event;
            console.log(event);
            console.log(Date.parse(this.outTime.toString()));
        } else {
            this.validDate = false;
        }
    }

    getRequests(page, limit) {
        const body = '?page=' + page + '&limit=' + limit;
        this.httpService.makeRequest(Constants.REQUEST + body, Constants.HTTP_GET, {}, (err, res) => {
            if (!err && res) {
                if (res.status === 404 || res.status === 500) {
                    this.toastr.error(res.messages, 'Error!');
                } else {
                    this.requests = res.data;
                    this.showAddCartModal(this.requests[0]);
                    this.totalItems = res.total;
                }
            }
        });
    }

    pageChanged(event: any): void {
        this.getRequests(event.page, this.itemsPerPage);
    }

    showNotificationModal(request: Request) {
        if (request && request.user_id && request.user_id.name) {
            this.notificationModal.showModal = true;
            this.notificationModal.id = request._id;
            this.notificationModal.receiverUserId = request.user_id._id;
            this.notificationModal.receiverUsername = request && request.user_id && request.user_id.name ? request.user_id.name : '';
            this.notificationModal.message = '';
        } else {
            this.toastr.error('Sorry, without username you cannot sent notification.', 'Error!');
        }
    }

    sendNotification() {
        if (this.notificationModal.receiverUserId && this.notificationModal.message) {
            const body = new URLSearchParams();
            body.set('receiver', this.notificationModal.receiverUserId);
            body.set('message', this.notificationModal.message);
            body.set('requestId', this.notificationModal.id);
            body.set('subject', 'From Request');
            this.httpService.makeRequest(Constants.NOTIFICATIONS + 'create', Constants.HTTP_POST, body, (err, res) => {
                console.log(err);
                console.log(res);
            });
        } else {
            this.toastr.error('Problem.', 'Error!');
        }
    }

    showAddCartModal(request: Request) {
        console.log(request);
        if (request) {
            this.addCartModal.showModal = true;
            this.addCartModal.requestId = request._id;
            this.addCartModal.name = request.name;
            this.addCartModal.quantity = request.quantity;
        }

    }

    addCart() {
        this.addCartModal.showModal = false;
        console.log(this.addCartModal);
        // this.addCartModal.total = (this.addCartModal.price * this.settingsService.dollarRate) + ((this.addCartModal.price * this.settingsService.dollarRate * this.addCartModal.quantity * this.addCartModal.service) / 100) + (this.addCartModal.taxType === '%' ? ((this.addCartModal.price * this.settingsService.dollarRate * this.addCartModal.quantity * this.addCartModal.tax) / 100) : this.addCartModal.tax) + this.addCartModal.shipping.price;
        const tax = (this.addCartModal.taxType === '%' ? ((this.addCartModal.price * this.settingsService.dollarRate * this.addCartModal.quantity * this.addCartModal.tax) / 100) : this.addCartModal.tax);
        if (this.addCartModal.showModal === false && this.addCartModal.requestId !== '' && this.addCartModal.name !== '' &&
            this.addCartModal.detail !== '' && this.addCartModal.picture !== '' && this.addCartModal.pictureMimeType !== '' &&
            this.addCartModal.price !== 0 && this.addCartModal.quantity !== 0 && this.total.round !== 0) {
            const body = new URLSearchParams();
            body.set('expiredTime', Date.parse(this.showDate.toString()).toString());
            body.set('name', this.addCartModal.name);
            body.set('detail', this.addCartModal.detail);
            body.set('requestId', this.addCartModal.requestId);
            body.set('picture', this.addCartModal.picture);
            body.set('price', (this.addCartModal.price * this.settingsService.dollarRate).toString());
            body.set('quantity', this.addCartModal.quantity.toString());
            body.set('service', this.addCartModal.service.toString());
            body.set('toBeDeclared', this.addCartModal.shipping.toBeDeclared.toString());
            body.set('shippingPrice', this.addCartModal.shipping.price.toString());
            body.set('tax', tax.toString());
            body.set('total', this.total.round.toString());
            this.httpService.makeRequest(Constants.GET_PRODUCT + 'addCart', Constants.HTTP_POST, body, (err, res) => {
                if (!err && res.status === 200) {
                    for (let i = 0; i < this.requests.length; i++) {
                        if (this.requests[i]._id === res.message._id) {
                            this.requests[i] = res.message;
                        }
                    }
                    this.toastr.success('Product added to user request.', 'Success!');
                    this.addCartModal = {
                        showModal: false,
                        requestId: '',
                        name: '',
                        detail: '',
                        picture: '',
                        pictureMimeType: '',
                        price: 0,
                        quantity: 1,
                        service: 0,
                        tax: 0,
                        taxType: '%',
                        shipping: {toBeDeclared: true, price: 0},
                        total: 0
                    };
                } else if (res.status === 205) {
                    this.toastr.error(res.messages, 'Error!');
                }
            });
        }
    }

    toBeDeclared(event) {
        this.addCartModal.shipping.toBeDeclared = event.target.checked;
        if (this.addCartModal.shipping.toBeDeclared) {
            this.addCartModal.shipping.price = 0;
        }
    }

    imageUpLoad(event) {
        this.addCartModal.pictureMimeType = '';
        this.addCartModal.picture = '';
        const files = event.target.files;
        const file = files[0];
        if (file) {
            this.addCartModal.pictureMimeType = file.type;
            const reader = new FileReader();
            reader.onload = this._handleReaderLoaded.bind(this);
            reader.readAsBinaryString(file);
        }
    }

    _handleReaderLoaded(readerEvt) {
        const self = this;
        const binaryString = readerEvt.target.result;
        const image = new Image();
        image.onload = function () {
            // if (image.width === 400 && image.height === 500) {
            //     self.addCartModal.picture = 'data:' + self.addCartModal.pictureMimeType + ';base64,' + btoa(binaryString);
            // } else {
            //     self.toastr.error('Image size doesn\'t match.', 'Error');
            // }
            self.addCartModal.picture = 'data:' + self.addCartModal.pictureMimeType + ';base64,' + btoa(binaryString);
        };
        image.src = 'data:' + self.addCartModal.pictureMimeType + ';base64,' + btoa(binaryString);

    }

    showProductDetail(request: Request) {
        console.log(request);
        this.showProductDetailModal.showModal = true;
        this.showProductDetailModal.request = request;
        console.log(+this.showProductDetailModal.request.expiredTime, new Date(+this.showProductDetailModal.request.expiredTime));
        console.log(Date.now(), new Date(Date.now()));
        if (Date.now() < this.showProductDetailModal.request.expiredTime) {
            this.showProceed.button = true;
            console.log('true');
        } else {
            this.showProceed.button = false;
            this.showProceed.expiredTime = new Date(+this.showProductDetailModal.request.expiredTime);
            console.log('false');
        }
    }

    proceed() {
        localStorage.setItem('requestCart', JSON.stringify(this.showProductDetailModal.request));
        return this.router.navigate(['/request/checkout']);
    }

    showOrderNotification(request: Request) {
        this.notificationModal.showRequestNotification = true;
        // this.notificationModal.showOrderNotificationDetail = order;
        this.httpService.makeRequest(Constants.NOTIFICATIONS + 'requestDetail/' + request._id, Constants.HTTP_GET, {}, (error, response) => {
            if (!error && response && response.status === 200) {
                this.notificationModal.showRequestNotificationDetail = response.data;
            }
        });
    }

    checkModalfalse() {
        this.checkModalOpen = false;
    }

    checkModaltrue() {
        this.checkModalOpen = true;
    }
}

