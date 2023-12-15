import {Division} from './Division';
import {District} from './District';

export class User {
    public _id: string;
    public name: string;
    public email: string;
    public recoveryCode: string;
    public phone: string;
    public division: Division = new Division();
    public district: District = new District();
    public address_1: string;
    public address_2: string;
    public zip: string;
    public shippingEmail: string;
    public shippingPhone: string;
    public status: number;
    public scope: string;
    public cart: {
        product: string,
        component: string,
        qty: number
    }[];

    constructor() {
        this._id = '';
        this.name = '';
        this.email = '';
        this.recoveryCode = '';
        this.phone = '';
        this.address_1 = '';
        this.address_2 = '';
        this.zip = '';
        this.shippingEmail = '';
        this.shippingPhone = '';
        this.status = 0;
        this.scope = '';
        this.cart = [];
    }

}
