import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Constants} from '../../../config/constants';
import {Product} from '../../../models/Product';
import {LayoutService} from '../../services/layout.service';
import {Http} from '@angular/http';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {NotificationsService} from '../../services/notifications.service';

@Component({
    selector: 'app-product-category',
    templateUrl: './product-category.component.html',
    styleUrls: ['./product-category.component.css']
})
export class ProductCategoryComponent implements OnInit {

    itemsPerPage = 10;
    products: Product[] = [];
    pagination: {
        limit: number,
        page: number,
        next: boolean
    };
    imageURL: string;
    categoryId: string;
    compo: { name: string, value: string }[] = [];
    compoQty: number;
    showModal: boolean;
    showModalProduct: Product = new Product();
    compo2: { name: string, value: {}[] }[] = [];
    menus: {}[] = [];
    search: {
        categoryId: string,
        search: string,
        from: number,
        to: number,
        color: string
    };
    color: string;

    constructor(public toastr: ToastsManager, vcr: ViewContainerRef, private http: Http, public layoutService: LayoutService, private router: Router, private activatedRouter: ActivatedRoute, private httpService: HttpService, public notificationsService: NotificationsService) {
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
        this.activatedRouter.params.subscribe(res => {
            this.categoryId = res.id;
        });
        this.imageURL = Constants.API_ENDPOINT;
        this.pagination = {limit: 20, page: 1, next: true};
        this.getMenu();
        this.search = {
            categoryId: '',
            search: '',
            from: 1,
            to: 200000,
            color: ''
        };
        this.color = '';
    }

    ngOnInit() {
        this.activatedRouter.params.subscribe(res => {
            this.search.categoryId = res.id;
            this.getDataBySearch();
        });
        this.search.search = '';
    }

    getMenu() {
        this.httpService.makeRequest(Constants.GET_SUB_CATEGORIES + 'menu', Constants.HTTP_GET, {}, (err, res) => {
            const abc = [];
            for (const c of res.category) {
                abc[c._id] = {_id: c._id, name: c.name, sub: []};
            }
            for (const sub of res.subCategory) {
                abc[sub.category_id]['sub'].push(sub);
            }

            for (const a of res.category) {
                this.menus.push(abc[a._id]);
            }

            // console.log(this.menus);
        });
    }


    getProducts() {
        // console.log('scr');
        // if (this.pagination.next) {
        //     const body = '?categoryId=' + this.categoryId + '&&page=' + this.pagination.page.toString() + '&limit=' + this.pagination.limit.toString();
        //
        //     this.httpService.makeRequest(Constants.GET_PRODUCT + '/category/' + body, Constants.HTTP_GET, {}, (err, res) => {
        //         if (!err && res) {
        //             if (res.status === 404 || res.status === 500) {
        //                  this.toastr.error(res.messages, 'Error!');
        //             } else {
        //                 this.products = this.products.concat(res.data);
        //                 console.log(this.products.length, 'productLenth');
        //                 this.pagination.next = res.next;
        //                 this.pagination.page += 1;
        //                 console.log(this.pagination.page, 'page');
        //             }
        //         }
        //     });
        // }
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

    go() {
        this.http.get('https://imagejournal.org/wp-content/uploads/bb-plugin/cache/23466317216_b99485ba14_o-panorama.jpg', {});
    }

    getDataBySearch() {
        let body = '?categoryId=' + this.search.categoryId;
        if (this.search.search) {
            body += '&search=' + this.search.search;
        }
        if (this.search.from) {
            body += '&minPrice=' + this.search.from + '&maxPrice=' + this.search.to;
        }
        if (this.search.color) {
            body += '&color=' + this.search.color;
        }
        console.log(body);
        this.httpService.makeRequest(Constants.GET_PRODUCT + 'category/' + body, Constants.HTTP_GET, {}, (err, res) => {
            console.log(err);
            console.log(res);
            if (!err && res) {
                if (res.status === 404 || res.status === 500) {
                    this.toastr.error(res.messages, 'Error!');
                } else {
                    this.products = res.data;
                }
            }
        });
    }

    myOnFinish(event) {
        this.search.from = event.from;
        this.search.to = event.to;
        this.getDataBySearch();
    }

    changeColor(event) {
        this.search.color = event;
        this.getDataBySearch();
    }
}
