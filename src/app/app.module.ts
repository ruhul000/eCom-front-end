import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {HttpModule, JsonpModule} from '@angular/http';
import {FroalaEditorModule, FroalaViewModule} from 'angular-froala-wysiwyg';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastModule} from 'ng2-toastr/ng2-toastr';
import {LottieAnimationViewModule} from 'ng-lottie';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {PaginationModule} from 'ngx-bootstrap/pagination';
import {CarouselModule} from 'ngx-bootstrap/carousel';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {TimepickerModule} from 'ngx-bootstrap/timepicker';
import {RatingModule} from 'ngx-bootstrap/rating';
import {IonRangeSliderModule} from 'ng2-ion-range-slider';

import {AppComponent} from './app.component';
import {HttpService} from './services/http.service';
import {LayoutService} from './services/layout.service';

import {LoginComponent} from './authentications/login/login.component';
import {LogoutComponent} from './authentications/logout/logout.component';
import {HeaderComponent} from './template-layout/header/header.component';
import {FooterComponent} from './template-layout/footer/footer.component';
import {HomeComponent} from './home/home.component';
import {ContactUsComponent} from './contact-us/contact-us.component';
import {ReactiveFormsModule} from '@angular/forms';
import {ProductDetailComponent} from './products/product-detail/product-detail.component';
import {CartComponent} from './cart/cart.component';
import {MyAccountComponent} from './authentications/my-account/my-account.component';
import {ChangePasswordComponent} from './authentications/change-password/change-password.component';
import {OrderHistoryComponent} from './orders/order-history/order-history.component';
import {WishlistComponent} from './wishlist/wishlist.component';
import {CheckoutComponent} from './checkout/checkout.component';
import {OrderDetailComponent} from './orders/order-detail/order-detail.component';
import {SidebarComponent} from './template-layout/sidebar/sidebar.component';
import {GlobalShoppingComponent} from './global-shopping/global-shopping.component';
import {ProductsComponent} from './products/products.component';
import {ProductCategoryComponent} from './products/product-category/product-category.component';
import {RequestComponent} from './request/request.component';
import {NotificationComponent} from './notification/notification.component';
import {ProcessingComponent} from './processing/processing.component';
import {SettingsService} from './services/settings.service';
import {RequestCheckoutComponent} from './request/request-checkout/request-checkout.component';
import {OrderSuccessComponent} from './orders/order-success/order-success.component';
import {OrderFailedComponent} from './orders/order-failed/order-failed.component';
import {EmailConfirmComponent} from './authentications/email-confirm/email-confirm.component';
import {ForgotPasswordComponent} from './authentications/forgot-password/forgot-password.component';
import {ResetPasswordComponent} from './authentications/reset-password/reset-password.component';
import {NotificationsService} from './services/notifications.service';
import {FacebookModule} from 'ngx-facebook';
import {PrivacyPolicyComponent} from './privacy-policy/privacy-policy.component';
import {TermsAndConditionComponent} from './terms-and-condition/terms-and-condition.component';
import {AmazonComponent} from './amazon/amazon.component';
import {AmazonHomeComponent} from './amazon/amazon-home/amazon-home.component';
import {FeatureProductComponent} from './products/feature-product/feature-product.component';
import {NewArivalComponent} from './products/new-arival/new-arival.component';

const appRoutes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'home', component: HomeComponent},
    {path: 'contact_us', component: ContactUsComponent},
    {path: 'user/login', component: LoginComponent},
    {path: 'user/logout', component: LogoutComponent},
    {path: 'product/detail/:id', component: ProductDetailComponent},
    {path: 'product/feature', component: FeatureProductComponent},
    {path: 'product/newArival', component: NewArivalComponent},
    {path: 'product/category/:id', component: ProductCategoryComponent},
    {path: 'product', component: ProductsComponent},
    {path: 'order/cart', component: CartComponent},
    {path: 'order/checkout', component: CheckoutComponent},
    {path: 'user/my_account', component: MyAccountComponent},
    {path: 'dashboard', component: MyAccountComponent},
    {path: 'user/change_password', component: ChangePasswordComponent},
    {path: 'order/successfull/:id', component: OrderSuccessComponent},
    {path: 'order/not_successfull', component: OrderFailedComponent},
    {path: 'order/all', component: OrderHistoryComponent},
    {path: 'order/detail/:id', component: OrderDetailComponent},
    {path: 'global_shopping', component: GlobalShoppingComponent},
    {path: 'request/all', component: RequestComponent},
    {path: 'user/wishlist', component: WishlistComponent},
    {path: 'user/wishlist', component: WishlistComponent},
    {path: 'notifications/all', component: NotificationComponent},
    {path: 'request/checkout', component: RequestCheckoutComponent},
    {path: 'confirm-email/:token', component: EmailConfirmComponent},
    {path: 'forgot-password', component: ForgotPasswordComponent},
    {path: 'reset-password/:token', component: ResetPasswordComponent},
    {path: 'terms-and-condition', component: TermsAndConditionComponent},
    {path: 'privacy-policy', component: PrivacyPolicyComponent},
    {path: 'amazon', component: AmazonComponent},
    {path: 'amazon/home', component: AmazonHomeComponent},
];

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        HomeComponent,
        ContactUsComponent,
        LoginComponent,
        ProductDetailComponent,
        CartComponent,
        MyAccountComponent,
        ChangePasswordComponent,
        OrderHistoryComponent,
        WishlistComponent,
        CheckoutComponent,
        OrderDetailComponent,
        SidebarComponent,
        GlobalShoppingComponent,
        LogoutComponent,
        ProductsComponent,
        ProductCategoryComponent,
        RequestComponent,
        ProductCategoryComponent,
        NotificationComponent,
        ProcessingComponent,
        RequestCheckoutComponent,
        OrderSuccessComponent,
        OrderFailedComponent,
        EmailConfirmComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent,
        PrivacyPolicyComponent,
        TermsAndConditionComponent,
        AmazonComponent,
        AmazonHomeComponent,
        FeatureProductComponent,
        NewArivalComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        JsonpModule,
        PaginationModule.forRoot(),
        CarouselModule.forRoot(),
        LottieAnimationViewModule.forRoot(),
        RouterModule.forRoot(
            appRoutes,
            {enableTracing: false}
        ),
        ReactiveFormsModule,
        InfiniteScrollModule,
        FroalaEditorModule.forRoot(),
        FroalaViewModule.forRoot(),
        BrowserAnimationsModule,
        ToastModule.forRoot(),
        BsDatepickerModule.forRoot(),
        TimepickerModule.forRoot(),
        RatingModule.forRoot(),
        FacebookModule.forRoot(),
        IonRangeSliderModule
    ],
    providers: [HttpService, LayoutService, SettingsService, NotificationsService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
