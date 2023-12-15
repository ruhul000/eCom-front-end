import {Component, OnInit} from '@angular/core';
import {ToastsManager} from 'ng2-toastr';

@Component({
    selector: 'app-order-failed',
    templateUrl: './order-failed.component.html',
    styleUrls: ['./order-failed.component.css']
})
export class OrderFailedComponent implements OnInit {

    constructor(public toastr: ToastsManager) {


    }

    ngOnInit() {
        this.toastr.error('Payment Not Completed.', 'Error!');
    }

}
