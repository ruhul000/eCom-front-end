import {Category} from './Category';

export class SubCategory {
    public name: string;
    public _id: string;
    public category_id: Category;

    constructor() {
        this.name = '';
        this._id = '';
        this.category_id = new Category();
    }

}
