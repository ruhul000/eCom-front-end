import {Category} from './Category';
import {SubCategory} from './SubCategory';

export class Product {
  public _id: string;
  public name: string;
  public discount: number;
  public feature: number;
  public images: {}[];
  public new: number;
  public price: number;
  public status: number;
  public shippingPrice: number;
  public components: {
    name: string,
    value: string
  }[];
    public detail: string;
    public description: string;
  public sub_category: SubCategory = new SubCategory();

  constructor() {
    this._id = '';
    this.name = '';
    this.discount = 0;
    this.feature = 0;
    this.images = [];
    this.new = 0;
    this.price = 0;
    this.shippingPrice = 0;
    this.status = 0;
    this.components = [];
    // this.category_id = new Category();
      this.detail = '';
      this.description = '';
  }
}



