import { Injectable } from '@angular/core';

@Injectable()
export class SettingsService {

    public amazon_photo: string;
    public amazon_text: string;
    public ali_express_photo: string;
    public ali_express_text: string;
    public phone: string;
    public proHeader1: string;
    public proLimit1: number;
    public proHeader2: string;
    public proLimit2: number;
    public dollarRate: number;
    public email: string;
    public bdOffice: string;
    public chinaOffice: string;
    public footerAbout: string;

    constructor() {
        this.amazon_photo = '';
        this.amazon_text = '';
        this.ali_express_photo = '';
        this.ali_express_text = '';
        this.phone = '';
        this.proHeader1 = '';
        this.proLimit1 = 20;
        this.proHeader2 = '';
        this.proLimit2 = 20;
        this.dollarRate = 0;
        this.email = '';
        this.bdOffice = '';
        this.chinaOffice = '';
        this.footerAbout = '';
    }

}
