import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Constants} from '../../../config/constants';
import {Product} from '../../../models/Product';
import {Review} from '../../../models/review';
import {LayoutService} from '../../services/layout.service';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {NotificationsService} from '../../services/notifications.service';

@Component({
    selector: 'app-product-detail',
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

    productId: string;
    product: Product;
    reviews: Review[] = [];
    imageURL: string;
    compo: { name: string, value: string }[] = [];
    compoQty = 1;

    constructor(public toastr: ToastsManager, vcr: ViewContainerRef, private router: Router, private activatedRouter: ActivatedRoute, private httpService: HttpService, public layoutService: LayoutService, public notificationsService: NotificationsService) {
        this.toastr.setRootViewContainerRef(vcr);
        if (this.layoutService.isLogin) {
            this.notificationsService.getNotifications();
        }
        this.activatedRouter.params.subscribe(res => {
            this.productId = res.id;
        });
        this.imageURL = Constants.API_ENDPOINT;
        this.product = new Product();
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
        this.getProduct();
        this.getReview();
    }

    getProduct() {
        const body = new URLSearchParams();
        this.httpService.makeRequest(Constants.GET_PRODUCT + this.productId, Constants.HTTP_GET, body, (err, res) => {
            if (!err && res) {
                if (res.status === 404 || res.status === 500) {
                    this.toastr.error(res.messages, 'Error!');
                } else {
                    this.product = res.data;
                    console.log('product', this.product);

                    for (let i = 0; i < this.product.components.length; i++) {
                        this.compo.push({
                            'name': this.product.components[i].name,
                            'value': this.product.components[i].value.split(',')[0]
                        });
                    }
                }
            }
        });
    }
    getReview() {
        const body = new URLSearchParams();
        this.httpService.makeRequest(Constants.GET_REVIEW + this.productId, Constants.HTTP_GET, body, (err, res) => {
            if (!err && res) {
                if (res.status === 404 || res.status === 500) {
                    this.toastr.error(res.messages, 'Error!');
                } else {
                    this.reviews = res.data;
                    console.log('reviews', this.reviews);
                }
            }
        });
    }

    selectComponent(componentName, componentIndex, componentValueIndex) {
        for (let i = 0; i < this.compo.length; i++) {
            if (this.compo[i].name === componentName) {
                this.compo[i].value = this.product.components[componentIndex].value.split(',')[componentValueIndex];
            }
        }
    }
    counter(i: number) {
        return new Array(i);
    }
}
