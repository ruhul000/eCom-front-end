import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Order} from '../../../models/Order';
import {Constants} from '../../../config/constants';
import {HttpService} from '../../services/http.service';
import {LayoutService} from '../../services/layout.service';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {NotificationsService} from '../../services/notifications.service';
import {Product} from '../../../models/Product';

@Component({
    selector: 'app-order-detail',
    templateUrl: './order-detail.component.html',
    styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {

    orderId: string;
    order: Order;
    imageURL: string;
    reviewOrder: { modalOpen: boolean, rate: number, text: string, order: Order, product: Product };

    constructor(public toastr: ToastsManager, vcr: ViewContainerRef, public layoutService: LayoutService, private router: Router, private route: ActivatedRoute, private httpService: HttpService, public notificationsService: NotificationsService) {
        this.toastr.setRootViewContainerRef(vcr);
        if (this.layoutService.isLogin) {
            this.notificationsService.getNotifications();
        }
        this.route.params.subscribe(res => {
            this.orderId = res.id;
        });
        if (!this.layoutService.isLogin) {
            this.router.navigate(['/user/login']);
        }
        this.imageURL = Constants.API_ENDPOINT;
        if (localStorage.getItem('message')) {
            this.toastr.success(localStorage.getItem('message'), 'Success!');
            localStorage.removeItem('message');
        }
        if (localStorage.getItem('errorMessage')) {
            this.toastr.error(localStorage.getItem('errorMessage'), 'Error!');
            localStorage.removeItem('errorMessage');
        }
        this.reviewOrder = {modalOpen: false, rate: 0, text: '', order: new Order(), product: new Product()};
    }

    ngOnInit() {
        this.getOrder();
    }

    getOrder() {
        this.httpService.makeRequest(Constants.GET_ORDER + this.orderId, Constants.HTTP_GET, {}, (err, res) => {
            if (!err && res) {
                if (res.status === 404 || res.status === 500) {
                    return this.toastr.error(res.messages, 'Error!');
                } else {
                    this.order = res.order;
                    console.log(this.order);
                }
            }
        });
    }

    printData() {
        let printContents, popupWin;
        printContents = document.getElementById('print-section').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
      <html>
        <head>
          <title></title>
          <link rel="stylesheet" href="assets/css/font-awesome/css/font-awesome.css">
        <!--<link rel="stylesheet" href="assets/css/bootstrap.min.css">-->
        <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="assets/js/vendors/isotope/isotope.css">
        <link rel="stylesheet" href="assets/js/vendors/slick/slick.css">
        <link rel="stylesheet" href="assets/js/vendors/rs-plugin/css/settings.css">
        <link rel="stylesheet" href="assets/js/vendors/select/jquery.selectBoxIt.css">
        <link rel="stylesheet" href="assets/css/subscribe-better.css">
        <link rel="stylesheet" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.2/themes/ui-lightness/jquery-ui.css">
        <link rel="stylesheet" href="assets/plugin/owl-carousel/owl.carousel.css">
        <link rel="stylesheet" href="assets/plugin/owl-carousel/owl.theme.css">
        <link rel="stylesheet" href="assets/css/style.css">
        <style>
        img{
        max-height: 50px;
        max-width: 50px;
        }
</style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
        );
        popupWin.document.close();
    }

    showReviewButton(product: Product) {
        console.log(product);
        this.order.products.forEach(function (orderProduct) {
            console.log(orderProduct);
            return orderProduct.name.toString() === product.name.toString();
        });
    }

    reviewProductOpenModal(product: Product) {
        this.reviewOrder = {modalOpen: true, rate: 0, text: '', order: this.order, product: product};
        console.log(this.reviewOrder);
    }

    reviewProductSubmit(reviewOrderData) {
        if ((reviewOrderData.rate > 0) && (reviewOrderData.text.length > 0)) {
            this.reviewOrder.modalOpen = false;
            const body = new URLSearchParams();
            body.append('orderId', reviewOrderData.order._id);
            body.append('productId', reviewOrderData.product._id);
            body.append('text', reviewOrderData.text);
            body.append('rate', reviewOrderData.rate);
            this.httpService.makeRequest(Constants.REVIEW_PRODUCT, Constants.HTTP_POST, body, (error, data) => {
                if (data.status === 201) {
                    return this.toastr.success('Product Successfully reviewed.', 'Successful');
                } else {
                    return this.toastr.error('Database is busy. Please Review Later.', 'Error!');
                }
            });
        }
    }
}
