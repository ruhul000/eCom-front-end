import {Injectable} from '@angular/core';
import {Constants} from '../../config/constants';
import {HttpService} from './http.service';
import {Cart} from '../../models/cart';
import {Product} from '../../models/Product';
import {NotificationsService} from './notifications.service';

@Injectable()
export class LayoutService {
    isLogin: boolean;
    userGroup: string;
    userName: string;
    userEmail: string;
    cart: Cart[];
    private cart2: Cart[];
    total_price: number;
    total_shippingPrice: number;
    total_discount: number;
    grand_total: number;
    imageURL: string;
    errorMessage: string;
    message: string;
    product: Product;
    search: string;
    searchProducts: Product[];
    pagination: { limit: number, page: number, next: boolean } = {limit: 20, page: 1, next: true};
    searchData: string;

    constructor(private httpService: HttpService, private notificationsService: NotificationsService) {
        this.cart = [];
        this.cart2 = [];
        this.isLogin = false;
        this.total_price = 0;
        this.total_discount = 0;
        this.total_shippingPrice = 0;
        this.grand_total = 0;
        this.errorMessage = '';
        this.message = '';
        this.search = '';
        this.searchProducts = [];
        if (this.isLogin) {
            this.notificationsService.getNotifications();
        }

    }

    public checkIsLogin() {
        if (localStorage.getItem('accessToken')) {
            this.httpService.makeRequest(Constants.PROFILE, Constants.HTTP_GET, {}, (err, res) => {
                if (res.status === 200) {
                    this.isLogin = true;
                    // Profile found
                    if (res && res.message && res.message.scope) {
                        this.userGroup = res.message.scope;
                        this.userName = res.message.name;
                        this.userEmail = res.message.email;
                    }

                } else {
                    this.userGroup = '';
                    this.userName = '';
                    this.userEmail = '';
                    this.isLogin = false;
                }
            });
        } else {
            this.userGroup = '';
            this.userName = '';
            this.userEmail = '';
            this.isLogin = false;
        }
    }

    getProducts() {
        let page = this.pagination.page;
        let next = this.pagination.next;
        console.log('console');
        // next = true;
        if (this.searchData !== this.search) {
            this.searchData = this.search;
            this.pagination.page = 1;
            page = 1;
            next = true;
            this.pagination.next = true;
        }
        if (next) {
            const body = '?page=' + page.toString() + '&limit=' + this.pagination.limit.toString() + '&search=' + this.search;

            this.httpService.makeRequest(Constants.GET_PRODUCT + body, Constants.HTTP_GET, {}, (err, res) => {
                console.log(res.data);
                if (!err && res) {
                    if (res.status === 404 || res.status === 500) {
                        this.errorMessage = res.messages;
                    } else {
                        if (page === 1) {
                            this.searchProducts = res.data;
                        } else {
                            this.searchProducts = this.searchProducts.concat(res.data);
                        }
                        this.pagination.next = res.next;
                        this.pagination.page = page + 1;
                        console.log(this.pagination.next);
                    }
                }
            });
        }
    }


    public checkCart() {
        if (localStorage.getItem('cart')) {
            this.cart = JSON.parse(localStorage.getItem('cart'));
        }
        if (localStorage.getItem('total_price')) {
            this.total_price = Number(localStorage.getItem('total_price'));
        }
        if (localStorage.getItem('total_discount')) {
            this.total_discount = Number(localStorage.getItem('total_discount'));
        }
        if (localStorage.getItem('total_shippingPrice')) {
            this.total_shippingPrice = Number(localStorage.getItem('total_shippingPrice'));
        }
        if (localStorage.getItem('grand_total')) {
            this.grand_total = Number(localStorage.getItem('grand_total'));
        }
    }

    public addToCart(id, from, component, qty) {
        if (from === 'local') {
            let total_price = 0;
            let total_discount = 0;
            let total_shippingPrice = 0;
            let grand_total = 0;
            let com = 0;
            let counter = 0;
            this.cart2 = [];
            for (const cartData of this.cart) {
                if (cartData._id === id && JSON.stringify(cartData.components) === JSON.stringify(component)) {
                    com = 1;
                    cartData.qty += qty;
                }
                this.cart2[counter++] = cartData;
                total_price += cartData.qty * cartData.price;
                total_shippingPrice += cartData.shippingPrice;
                if (cartData.discount > 0) {
                    total_discount += cartData.qty * cartData.price * cartData.discount / 100;
                    grand_total += (cartData.qty * (cartData.price - (cartData.price * cartData.discount / 100))) + cartData.shippingPrice;
                } else {
                    grand_total += (cartData.qty * cartData.price) + cartData.shippingPrice;
                }
            }
            if (com === 0) {
                const body = new URLSearchParams();
                this.httpService.makeRequest(Constants.GET_PRODUCT + id, Constants.HTTP_GET, body, (err, res) => {
                    if (!err && res) {
                        if (res.status === 404 || res.status === 500) {
                            this.errorMessage = res.messages;
                        } else {
                            const CartData: Cart = {
                                _id: res.data._id.toString(),
                                qty: +qty,
                                name: res.data.name.toString(),
                                price: +res.data.price,
                                shippingPrice: +res.data.shippingPrice,
                                discount: +res.data.discount,
                                images: res.data.images[0],
                                components: component
                            };
                            this.cart2.push(CartData);
                            this.cart = this.cart2;
                            this.total_price += CartData.qty * CartData.price;
                            this.total_shippingPrice += CartData.shippingPrice;
                            if (CartData.discount > 0) {
                                this.total_discount += CartData.qty * CartData.price * CartData.discount / 100;
                                this.grand_total += (CartData.qty * (CartData.price - (CartData.price * CartData.discount / 100))) + CartData.shippingPrice;
                            } else {
                                this.grand_total += (CartData.qty * CartData.price) + CartData.shippingPrice;
                            }
                        }
                        localStorage.setItem('cart', JSON.stringify(this.cart));
                        localStorage.setItem('total_price', this.total_price.toString());
                        localStorage.setItem('total_discount', this.total_discount.toString());
                        localStorage.setItem('total_shippingPrice', this.total_shippingPrice.toString());
                        localStorage.setItem('grand_total', this.grand_total.toString());
                    }
                });
            } else {
                this.cart = this.cart2;
                this.total_price = total_price;
                this.total_discount = total_discount;
                this.total_shippingPrice = total_shippingPrice;
                this.grand_total = grand_total;
                localStorage.setItem('cart', JSON.stringify(this.cart));
                localStorage.setItem('total_price', this.total_price.toString());
                localStorage.setItem('total_discount', this.total_discount.toString());
                localStorage.setItem('total_shippingPrice', this.total_shippingPrice.toString());
                localStorage.setItem('grand_total', this.grand_total.toString());
            }
        }
    }

    public changeCartQty(cartdata, qty) {
        let total_price = 0;
        let total_discount = 0;
        let total_shippingPrice = 0;
        let grand_total = 0;
        this.cart2 = [];
        let counter = 0;
        for (const cartData of this.cart) {
            if (JSON.stringify(cartdata) === JSON.stringify(cartData)) {
                // cartData.qty -= 1; // Delete One By one
                cartData.qty = qty; // Delete Full
            }

            this.cart2[counter++] = cartData;
            total_shippingPrice += cartData.shippingPrice;
            total_price += cartData.qty * cartData.price;
            if (cartData.discount > 0) {
                total_discount += cartData.qty * cartData.price * cartData.discount / 100;
                grand_total += (cartData.qty * (cartData.price - (cartData.price * cartData.discount / 100))) + cartData.shippingPrice;
            } else {
                grand_total += (cartData.qty * cartData.price) + cartData.shippingPrice;
            }

        }

        this.cart = this.cart2;
        this.total_price = total_price;
        this.total_discount = total_discount;
        this.total_shippingPrice = total_shippingPrice;
        this.grand_total = grand_total;
        localStorage.setItem('cart', JSON.stringify(this.cart));
        localStorage.setItem('total_price', this.total_price.toString());
        localStorage.setItem('total_discount', this.total_discount.toString());
        localStorage.setItem('total_shippingPrice', this.total_shippingPrice.toString());
        localStorage.setItem('grand_total', this.grand_total.toString());
    }

    public removeToCart(cartdata) {

        let total_price = 0;
        let total_discount = 0;
        let total_shippingPrice = 0;
        let grand_total = 0;
        this.cart2 = [];
        let counter = 0;
        for (const cartData of this.cart) {
            if (JSON.stringify(cartdata) === JSON.stringify(cartData)) {
                // cartData.qty -= 1; // Delete One By one
                cartData.qty = 0; // Delete Full
            }
            if (cartData.qty > 0) {
                this.cart2[counter++] = cartData;
                total_shippingPrice += cartData.shippingPrice;
                total_price += cartData.qty * cartData.price;
                if (cartData.discount > 0) {
                    total_discount += cartData.qty * cartData.price * cartData.discount / 100;
                    grand_total += (cartData.qty * (cartData.price - (cartData.price * cartData.discount / 100))) + cartData.shippingPrice;
                } else {
                    grand_total += (cartData.qty * cartData.price) + cartData.shippingPrice;
                }
            }
        }

        this.cart = this.cart2;
        this.total_price = total_price;
        this.total_discount = total_discount;
        this.total_shippingPrice = total_shippingPrice;
        this.grand_total = grand_total;
        localStorage.setItem('cart', JSON.stringify(this.cart));
        localStorage.setItem('total_price', this.total_price.toString());
        localStorage.setItem('total_discount', this.total_discount.toString());
        localStorage.setItem('total_shippingPrice', this.total_shippingPrice.toString());
        localStorage.setItem('grand_total', this.grand_total.toString());

    }
}
