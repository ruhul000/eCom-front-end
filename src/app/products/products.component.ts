import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Constants} from '../../config/constants';
import {Product} from '../../models/Product';
import {LayoutService} from '../services/layout.service';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {NotificationsService} from '../services/notifications.service';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

    imageURL: string;
    categoryId: string;
    compo: { name: string, value: string }[] = [];
    compoQty: number;
    showModal: boolean;
    showModalProduct: Product = new Product();
    compo2: { name: string, value: {}[] }[] = [];

    constructor(public toastr: ToastsManager, vcr: ViewContainerRef, public layoutService: LayoutService, private router: Router, private activatedRouter: ActivatedRoute, public notificationsService: NotificationsService) {
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
        console.log('console');
        this.layoutService.getProducts();
    }

}
