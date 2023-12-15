import {User} from './User';

export class Request {
    public _id: string;
    public name: string;
    public time: string;
    public brand: string;
    public url: string;
    public notes: string;
    public quantity: number;
    public price: number;
    public service: number;
    public tax: number;
    public toBeDeclared: string;
    public total: number;
    public expiredTime: number;
    public user_id: User;
    public cart: object;
    public picture: string;
    public shippingPrice: string;
    public detail: string;

    constructor() {
        this._id = '';
        this.name = '';
        this.brand = '';
        this.quantity = 0;
        this.price = 0;
        this.service = 0;
        this.tax = 0;
        this.total = 0;
        this.expiredTime = 0;
        this.url = '';
        this.notes = '';
        this.time = '2018-01-15T06:30:15.177Z';
        this.user_id = new User();
        this.cart = {};
        this.picture = '';
        this.shippingPrice = '';
        this.detail = '';
        this.toBeDeclared = '';
    }
}
