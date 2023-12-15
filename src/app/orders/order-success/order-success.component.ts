import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastsManager} from 'ng2-toastr';
import {LayoutService} from '../../services/layout.service';

@Component({
    selector: 'app-order-success',
    templateUrl: './order-success.component.html',
    styleUrls: ['./order-success.component.css']
})
export class OrderSuccessComponent implements OnInit {
    orderId: string;

    constructor(public layoutService: LayoutService, public toastr: ToastsManager, private router: Router, private route: ActivatedRoute) {
        this.route.params.subscribe(res => {
            this.orderId = res.id;
        });
        this.toastr.success('Payment Completed', 'Success!');
    }

    ngOnInit() {
        localStorage.removeItem('cart');
        localStorage.removeItem('total_price');
        localStorage.removeItem('total_discount');
        localStorage.removeItem('total_shippingPrice');
        localStorage.removeItem('grand_total');
        this.layoutService.cart = [];
        this.layoutService.total_price = 0;
        this.layoutService.total_shippingPrice = 0;
        this.layoutService.total_discount = 0;
        this.layoutService.grand_total = 0;
    }

}
