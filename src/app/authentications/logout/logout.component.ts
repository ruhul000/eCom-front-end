import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {NavigationEnd, Router} from '@angular/router';
import {LayoutService} from '../../services/layout.service';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {NotificationsService} from '../../services/notifications.service';

@Component({
    selector: 'app-logout',
    templateUrl: './logout.component.html',
    styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

    lottieConfig: object;

    constructor(public toastr: ToastsManager, vcr: ViewContainerRef, public layoutService: LayoutService, private httpService: HttpService, private router: Router, public notificationsService: NotificationsService) {
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
        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0);
        });
        this.lottieConfig = {
            path: 'assets/animations/preloader.json',
            autoplay: true,
            loop: true
        };
        if (localStorage.getItem('accessToken')) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user_group');
            localStorage.setItem('message', 'Logout successful.');
            this.layoutService.isLogin = false;
            this.router.navigate(['/user/login']);
        } else {
            return this.router.navigate(['/user/login']);
        }
    }

}
