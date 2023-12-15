import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {SettingsService} from '../../services/settings.service';
import {Constants} from '../../../config/constants';
import {HttpService} from '../../services/http.service';
import {NotificationsService} from '../../services/notifications.service';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

    constructor(public httpService: HttpService, public settingsService: SettingsService, public toastr: ToastsManager, vcr: ViewContainerRef, public notificationsService: NotificationsService) {
        this.toastr.setRootViewContainerRef(vcr);
        if (localStorage.getItem('message')) {
            this.toastr.success(localStorage.getItem('message'), 'Success!');
            localStorage.removeItem('message');
        }
        if (localStorage.getItem('errorMessage')) {
            this.toastr.error(localStorage.getItem('errorMessage'), 'Error!');
            localStorage.removeItem('errorMessage');
        }
    }

    ngOnInit() {
        this.getSettings();
    }

    getSettings() {
        this.httpService.makeRequest(Constants.SITES, Constants.HTTP_GET, {}, (err, res) => {
            this.settingsService = res.data;
        });
    }

}
