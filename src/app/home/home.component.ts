import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {HttpService} from '../services/http.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Constants} from '../../config/constants';
import {LayoutService} from '../services/layout.service';
import {Product} from '../../models/Product';
import {Slider} from '../../models/Slider';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {SettingsService} from '../services/settings.service';
import {NotificationsService} from '../services/notifications.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    sliders: Slider[] = [];
    featuredProducts: Product[] = [];
    newArival: Product[] = [];
    imageURL: string;
    compo: { name: string, value: string }[] = [];
    compo2: { name: string, value: {}[] }[] = [];
    compoQty: number;
    showModal: boolean;
    showModalProduct: Product = new Product();

    constructor(public toastr: ToastsManager, vcr: ViewContainerRef, public layoutService: LayoutService, private router: Router, private activatedRouter: ActivatedRoute, private httpService: HttpService, public settingsService: SettingsService, public notificationsService: NotificationsService) {
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
    }

    ngOnInit() {
        this.getSliders();
        this.getFeaturedProduct();
        this.getNewArival();
        this.getSettings();
    }

    getSettings() {
        this.httpService.makeRequest(Constants.SITES, Constants.HTTP_GET, {}, (err, res) => {
            if (!err && res.status === 200) {
                this.settingsService = res.data;
                console.log(this.settingsService );
                console.log('res.data', res.data );
            }
        });
    }

    // getData(url) {
    //   return url;
    // }

    getSliders() {
        this.httpService.makeRequest(Constants.SLIDER_ALL, Constants.HTTP_GET, {}, (err, res) => {
            if (!err && res.status === 200) {
                this.sliders = res.data;
            }
        });
    }

    getFeaturedProduct() {
        const body = '?limit=' + this.settingsService.proLimit1.toString();
        console.log(body);
        this.httpService.makeRequest(Constants.GET_PRODUCT + 'FeatureProduct/' + body, Constants.HTTP_GET, {}, (err, res) => {
            if (!err && res.status === 200) {
                this.featuredProducts = res.data;
                console.log(res.data);
            }
        });
    }

    getNewArival() {
        const body = '?limit=' + this.settingsService.proLimit2.toString();
        this.httpService.makeRequest(Constants.GET_PRODUCT + 'NewArival/' + body, Constants.HTTP_GET, {}, (err, res) => {
            if (!err && res.status === 200) {
                this.newArival = res.data;
            }
        });
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
}
