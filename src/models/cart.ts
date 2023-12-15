export class Cart {
  public name: string;
  public _id: string;
  public qty: number;
  public price: number;
  public components: {
    name: string,
    value: string
  }[];
  public discount: number;
  public shippingPrice: number;
  public images: string;
  constructor() {
      this.name = '';
      this._id = '';
      this.qty = 0;
      this.price = 0;
      this.discount = 0;
      this.shippingPrice = 0;
      this.components = [];
  }
}
