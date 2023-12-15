import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {Constants} from '../../../config/constants';
import {LayoutService} from '../../services/layout.service';
import {Category} from '../../../models/Category';
import {HttpService} from '../../services/http.service';
import {Router} from '@angular/router';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {SettingsService} from '../../services/settings.service';
import {NotificationsService} from '../../services/notifications.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

    isOpenCategory: boolean;
    isOpenAccount: boolean;
    categories: Category[];
    imageURL: string;
    menus: {}[] = [];

    constructor(public settingsService: SettingsService, public toastr: ToastsManager, vcr: ViewContainerRef,
                public layoutService: LayoutService, public httpService: HttpService,
                private router: Router, public notificationsService: NotificationsService) {
        this.toastr.setRootViewContainerRef(vcr);
        if (this.layoutService.isLogin) {
            this.notificationsService.getNotifications();
        }
        if (localStorage.getItem('message')) {
            this.toastr.success(localStorage.getItem('message'), 'Success!');
            localStorage.removeItem('message');
        }
        if (localStorage.getItem('errorMessage')) {
            this.toastr.error(localStorage.getItem('errorMessage'), 'Error!');
            localStorage.removeItem('errorMessage');
        }
        this.categories = [];
        this.imageURL = Constants.API_ENDPOINT;
        this.getSettings();
    }

    getSettings() {
        this.httpService.makeRequest(Constants.SITES, Constants.HTTP_GET, {}, (err, res) => {
            this.settingsService = res.data;
        });
    }

    ngOnInit() {
        this.getCategories();
        this.isOpenCategory = false;
        this.isOpenAccount = false;
        this.getMenu();
    }

    getMenu() {
        this.httpService.makeRequest(Constants.GET_SUB_CATEGORIES + 'menu', Constants.HTTP_GET, {}, (err, res) => {
            const abc = [];
            for (const c of res.category) {
                abc[c._id] = {_id: c._id, name: c.name, sub: []};
            }
            for (const sub of res.subCategory) {
                abc[sub.category_id]['sub'].push(sub);
            }

            for (const a of res.category) {
                this.menus.push(abc[a._id]);
            }
        });
    }

    getCategories() {
        const body = new URLSearchParams();
        this.httpService.makeRequest(Constants.GET_CATEGORY, Constants.HTTP_GET, body, (err, res) => {
            if (!err && res) {
                if (res.status === 200) {
                    this.categories = res.data;

                }
            }
        });
    }

    getProduct(data) {
        this.layoutService.search = data;
        this.router.navigate(['/product']);
        this.layoutService.getProducts();
    }
}
