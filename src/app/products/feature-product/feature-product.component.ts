import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Constants} from '../../../config/constants';
import {Product} from '../../../models/Product';
import {LayoutService} from '../../services/layout.service';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {NotificationsService} from '../../services/notifications.service';
import {HttpService} from '../../services/http.service';
import {SettingsService} from '../../services/settings.service';

@Component({
  selector: 'app-feature-product',
  templateUrl: './feature-product.component.html',
  styleUrls: ['./feature-product.component.css']
})
export class FeatureProductComponent implements OnInit {

    imageURL: string;
    categoryId: string;
    products: Product[] = [];
    compo: { name: string, value: string }[] = [];
    compoQty: number;
    showModal: boolean;
    showModalProduct: Product = new Product();
    compo2: { name: string, value: {}[] }[] = [];

    pagination: { limit: number, page: number, next: boolean } = {limit: 20, page: 1, next: true};

    constructor(public settingsService: SettingsService, private httpService: HttpService, public toastr: ToastsManager, vcr: ViewContainerRef, public layoutService: LayoutService, private router: Router, private activatedRouter: ActivatedRoute, public notificationsService: NotificationsService) {
        this.toastr.setRootViewContainerRef(vcr);
        if (this.layoutService.isLogin) {
            this.notificationsService.getNotifications();
        }
        this.compoQty = 1;
        this.showModal = false;
        if (localStorage.getItem('message')) {
            this.toastr.success(localStorage.getItem('message'), 'Success!');
            localStorage.removeItem('message');
        }
        if (localStorage.getItem('errorMessage')) {
            this.toastr.error(localStorage.getItem('errorMessage'), 'Error!');
            localStorage.removeItem('errorMessage');
        }
        this.imageURL = Constants.API_ENDPOINT;
        this.activatedRouter.params.subscribe(res => {
            this.categoryId = res.id;
        });
    }

    ngOnInit() {
        this.layoutService.getProducts();
    }

    showProductModal(product: Product) {
        this.compo = [];
        this.compoQty = 1;
        this.showModal = true;
        this.showModalProduct = product;
        this.compo2 = [];
        for (let i = 0; i < product.components.length; i++) {
            this.compo.push({'name': product.components[i].name, 'value': product.components[i].value.split(',')[0]});
            const value = [];
            for (let j = 0; j < product.components[i].value.split(',').length; j++) {
                value.push(product.components[i].value.split(',')[j]);
                if (product.components[i].value.split(',').length - 1 === j) {
                    this.compo2.push({'name': product.components[i].name, 'value': value});
                }
            }
        }
    }

    selectComponent(componentName, componentValue) {
        for (let i = 0; i < this.compo.length; i++) {
            if (this.compo[i].name === componentName) {
                this.compo[i].value = componentValue;
            }
        }
    }

    getProducts() {
        const page = this.pagination.page;
        const next = this.pagination.next;
        if (next) {
            const body = 'limit/FeatureProduct?page=' + page.toString() + '&limit=' + this.pagination.limit.toString();

            this.httpService.makeRequest(Constants.GET_PRODUCT + body, Constants.HTTP_GET, {}, (err, res) => {
                console.log(res.data);
                if (!err && res) {
                    if (res.status === 404 || res.status === 500) {
                        console.log(res.messages);
                    } else {
                        if (page === 1) {
                            this.products = res.data;
                        } else {
                            this.products = this.products.concat(res.data);
                        }
                        this.pagination.next = res.next;
                        this.pagination.page = page + 1;
                    }
                }
            });
        }
    }

}
