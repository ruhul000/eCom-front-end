import {User} from './User';
import {Division} from './Division';
import {District} from './District';

export class Order {
    public _id: string;
    public total: number;
    public subtotal: number;
    public discount: number;
    public shippingPrice: number;
    public tax: number;
    public service: number;
    public time: string;
    public status: string;
    public user_id: User;
    public shippingAddress: {
        division: Division,
        district: District,
        address_1: string,
        address_2: string,
        zip: string,
        shippingEmail: string,
        shippingPhone: string
    };
    public paymentStatus: number;
    public paymentType: string;
    public paymentInfo: {
        token: string,
        txn_details: string,
        card_details: string,
        payment_card: string,
        txn_time: string
    };
    public order_id: string;
    public products: {
        _id: string,
        name: string,
        price: number,
        discount: number,
        shippingPrice: number,
        qty: number,
        images: string,
        components: {
            name: string,
            value: string
        }[]
    }[];

    constructor() {
        this._id = '';
        this.total = 0;
        this.subtotal = 0;
        this.tax = 0;
        this.service = 0;
        this.shippingPrice = 0;
        this.discount = 0;
        this.time = '2018-01-15T06:30:15.177Z';
        this.status = '';
        this.user_id = new User();
        this.products = [];
        this.paymentStatus = 0;
        this.paymentType = '';
        this.paymentInfo = {
            token: '',
            txn_details: '',
            card_details: '',
            payment_card: '',
            txn_time: ''
        };
        this.order_id = '';
    }
}
