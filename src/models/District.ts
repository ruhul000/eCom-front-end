import {Division} from './Division';

export class District {
  public _id: string;
  public division_id: Division;
  // public division_id: Division;
  public name: string;

  constructor () {
    this._id = '';
    this.division_id = new Division();
    // this.division_id = new Division();
    this.name = '';
  }
}
