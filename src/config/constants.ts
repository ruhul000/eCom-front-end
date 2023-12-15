import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: []
})
export class Constants {
    public static HTTP_GET = 'GET';
    public static HTTP_POST = 'POST';
    public static HTTP_PUT = 'PUT';
    public static HTTP_DELETE = 'DELETE';
    public static API_ENDPOINT = 'http://api.ajkershopping.com/';
    // public static API_ENDPOINT = 'http://api.zettatech.co/';
    // public static API_ENDPOINT = 'http://localhost:3000/';

    /*Amazon*/
    public static AmazonAccessKeyId = 'AKIAJXNAYMBRCAEG6ZTQ';
    public static AmazonSecretKey = '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';
    public static AmazonEndPoint = 'webservices.amazon.com';
    public static AmazonUri = '/onca/xml';
    public static AmazonService = 'AWSECommerceService';
    public static AmazonAssociateTag = 'ajkershopping-20';
    public static AmazonResponseGroup = 'Images,ItemAttributes,Offers';

    /*Facebook clients*/
    public static FB_APP_ID = '207228489855548';
    public static FB_XFBML = true;
    public static FB_VERSION = 'v2.11';

    public static USER_LOGIN = Constants.API_ENDPOINT + 'user/login/';
    public static USER_FB_LOGIN = Constants.API_ENDPOINT + 'user/fb-login/';
    public static USER_REGISTER = Constants.API_ENDPOINT + 'user/register/';
    public static USER_CREATE = Constants.API_ENDPOINT + 'user/create/';
    public static GET_PRODUCT = Constants.API_ENDPOINT + 'products/';
    public static EDIT_PRODUCT = Constants.API_ENDPOINT + 'products/edit/';
    public static GET_CATEGORY = Constants.API_ENDPOINT + 'category/';
    public static ORDER_POST = Constants.API_ENDPOINT + 'order/';
    public static GET_ORDER = Constants.API_ENDPOINT + 'order/';
    public static GET_USER = Constants.API_ENDPOINT + 'user/all/';
    public static GET_SUB_CATEGORIES = Constants.API_ENDPOINT + 'sub-category/';
    public static GET_DIVISIONS = Constants.API_ENDPOINT + 'divisions/';
    public static GET_DISTRICTS = Constants.API_ENDPOINT + 'districts/';
    public static GET_SLIDERS = Constants.API_ENDPOINT + 'sliders/';
    public static GET_GLOBAL_SLIDERS = Constants.API_ENDPOINT + 'global-sliders/';
    public static GLOBAL_SLIDER_ALL = Constants.API_ENDPOINT + 'global-sliders/show/all';
    public static SLIDER_ALL = Constants.API_ENDPOINT + 'sliders/show/all';
    public static USER_URL = Constants.API_ENDPOINT + 'user/';
    public static PRODUCT_URL = Constants.API_ENDPOINT + 'products/';

    public static PROFILE = Constants.API_ENDPOINT + 'user/profile/';
    public static PROFILE_EDIT = Constants.API_ENDPOINT + 'user/edit/';
    public static PROFILE_UPDATE = Constants.API_ENDPOINT + 'user/profile/update';
    public static EMAIL_VALIDATION = Constants.API_ENDPOINT + 'user/email-validation';
    public static FORGOT_PASSWORD = Constants.API_ENDPOINT + 'user/forgot-password';
    public static RESET_PASSWORD = Constants.API_ENDPOINT + 'user/reset-password';

    public static REVIEW_PRODUCT = Constants.API_ENDPOINT + 'review/product';
    public static GET_REVIEW = Constants.API_ENDPOINT + 'review/';

    public static REQUEST = Constants.API_ENDPOINT + 'request/';
    public static NOTIFICATIONS = Constants.API_ENDPOINT + 'notifications/';
    public static All_NOTIFICATIONS = Constants.API_ENDPOINT + 'notifications/all';
    public static SITES = Constants.API_ENDPOINT + 'sites/';
    public static wmx_id = 'WMX5a801472201e2';
    public static app_name = 'ajkershopping.com';
    public static cart_info = 'WMX5a801472201e2,http://ajkershopping.com/,ajkershopping.com';
    public static currency = 'BDT';
    public static option = 'cz1hamtlcnNob3BwaW5nLmNvbSxpPTE2NS4yMjcuMTg0LjI=';
    public static callback_url = 'http://api.zettatech.co/payment/walletmax/';
    public static access_app_key = '68083635ecf24f06bc1ed0f60c560c11ec5959ef';
    public static authorization = 'Basic YWprZXJzaG9wcGluZ185OTQ4MjY4MDM6YWprZXJzaG9wcGluZ181NzE4MzY3OTA=';
}
