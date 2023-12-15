import {Component, OnInit} from '@angular/core';
import {LayoutService} from './services/layout.service';
import {NavigationEnd, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import {Constants} from '../config/constants';
import {HttpService} from './services/http.service';
import {SettingsService} from './services/settings.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'app';

    constructor(public layoutService: LayoutService, private router: Router, private httpService: HttpService, public settingsService: SettingsService) {
        // this.layoutService.checkIsLogin();
        this.layoutService.checkCart();
        this.goTop();
        Observable.interval(5000).subscribe(() => {
            this.layoutService.checkCart();
        });

        this.getSettingData();
    }

    ngOnInit() {
        this.layoutService.checkIsLogin();
    }

    goTop() {
        this.router.events.subscribe(evt => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            window.scroll(0, 0);
        });
    }

    getSettingData() {
        this.httpService.makeRequest(Constants.SITES, Constants.HTTP_GET, {}, (err, res) => {
            if (!err && res) {
                this.settingsService.amazon_photo = res.data.amazon_photo;
                this.settingsService.ali_express_photo = res.data.ali_express_photo;
                this.settingsService.phone = res.data.phone;
                this.settingsService.dollarRate = res.data.dollarRate;
                this.settingsService.amazon_text = res.data.amazon_text;
                this.settingsService.ali_express_text = res.data.ali_express_text;
                this.settingsService.proHeader1 = res.data.proHeader1;
                this.settingsService.proLimit1 = res.data.proLimit1;
                this.settingsService.proHeader2 = res.data.proHeader2;
                this.settingsService.proLimit2 = res.data.proLimit2;
                this.settingsService.email = res.data.email;
                this.settingsService.bdOffice = res.data.bdOffice;
                this.settingsService.chinaOffice = res.data.chinaOffice;
                this.settingsService.footerAbout = res.data.footerAbout;
            }
        });
    }
}
