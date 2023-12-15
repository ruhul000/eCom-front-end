import {Component, OnInit} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Constants} from '../../../config/constants';
import * as moment from 'moment';
import * as crypto from 'crypto-js';

@Component({
    selector: 'app-amazon-home',
    templateUrl: './amazon-home.component.html',
    styleUrls: ['./amazon-home.component.css']
})
export class AmazonHomeComponent implements OnInit {

    secretKey: string;
    endPoint: string;
    uri: string;
    requestUrl: string;
    constructor(private http: Http) {
    }

    ngOnInit() {
        this.amazonData();
    }

    amazonData() {
        const accessKeyId = Constants.AmazonAccessKeyId;
        this.secretKey = Constants.AmazonSecretKey;
        this.endPoint = Constants.AmazonEndPoint;
        this.uri = Constants.AmazonUri;
        const unOrderedParams = {
            'Service': 'AWSECommerceService',
            'Operation': 'ItemSearch',
            'AWSAccessKeyId': accessKeyId,
            'AssociateTag': Constants.AmazonAssociateTag,
            'SearchIndex': 'All',
            'ResponseGroup': Constants.AmazonResponseGroup,
            'Availability': 'Available',
            'Keywords': 'book'
        };
        if (!('Timestamp' in unOrderedParams)) {
            unOrderedParams['Timestamp'] = moment().toISOString();
        }
        console.log('unOrderedParams', unOrderedParams);
        const orderedParams = {};
        Object.keys(unOrderedParams).sort().forEach((key) => {
            orderedParams[key] = unOrderedParams[key];
        });

        const encodedParams = [];
        for (const key in orderedParams) {
            if (orderedParams.hasOwnProperty(key)) {
                encodedParams.push(encodeURIComponent(key) + '=' + encodeURIComponent(orderedParams[key]));
            }
        }

        const canonicalQueryString = encodedParams.join('&');
        console.log(canonicalQueryString);
        const stringToSign = 'GET\n' + this.endPoint + '\n' + this.uri + '\n' + canonicalQueryString;
        console.log(stringToSign);
        const signature = crypto.enc.Base64.stringify(crypto.HmacSHA256(stringToSign, this.secretKey));
        console.log(signature);
        this.requestUrl = 'http://' + this.endPoint + this.uri + '?' + canonicalQueryString + '&Signature=' + encodeURIComponent(signature);
        this.http.get(this.requestUrl, {}).subscribe((responsedata: Response) => {
           console.log(responsedata);
        });
    }

}
