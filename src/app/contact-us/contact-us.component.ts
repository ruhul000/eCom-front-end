import {Component, OnInit, ViewContainerRef, ViewEncapsulation} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {Constants} from '../../config/constants';
import {SettingsService} from '../services/settings.service';
import {HttpService} from '../services/http.service';
import {NotificationsService} from '../services/notifications.service';
import {LayoutService} from '../services/layout.service';

@Component({
    selector: 'app-contact-us',
    templateUrl: './contact-us.component.html',
    styleUrls: ['./contact-us.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ContactUsComponent implements OnInit {

    form: FormGroup;

    constructor(public httpService: HttpService, public layoutService: LayoutService, public settingsService: SettingsService, public toastr: ToastsManager, vcr: ViewContainerRef, private fb: FormBuilder, public notificationsService: NotificationsService) {
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
    }

    ngOnInit() {
        this.form = this.fb.group({
            name: ['', Validators.compose([Validators.required])],
            email: ['', Validators.compose([Validators.required, Validators.email])],
            subject: ['', Validators.compose([Validators.required])],
            message: ['', Validators.compose([Validators.required, Validators.maxLength(500)])]
        });
        this.getSettings();
    }

    getSettings() {
        this.httpService.makeRequest(Constants.SITES, Constants.HTTP_GET, {}, (err, res) => {
            this.settingsService = res.data;
        });
    }

    submit() {
        if (this.form.valid) {
        }
    }


}
