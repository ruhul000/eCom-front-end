import {User} from './User';
export class Review {
    public _id: string;
    public product_id: string;
    public user_id: User;
    public order_id: string;
    public text: string;
    public time: string;
    public rate: number;
    constructor() {
        this._id = '';
        this.user_id = new User();
        this.product_id = '';
        this.order_id = '';
        this.text = '';
        this.time = '';
        this.rate = 0;
    }
}
