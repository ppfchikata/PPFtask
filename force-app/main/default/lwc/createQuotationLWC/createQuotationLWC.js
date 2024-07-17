import { LightningElement, api, wire } from 'lwc';
import getProductList from '@salesforce/apex/GetAllProduct.getProductList';
import getQuotationConnectRecord from '@salesforce/apex/GetQuotationConnectRecord.getQuotationConnectRecord';
import { FlowNavigationNextEvent } from 'lightning/flowSupport';

export default class CreateQuotationLWC extends LightningElement {
    @api GetList;
    GetList = [];
    columnsDefine = [
        { label:'ID',fieldName:'Id',type:''},
        { label:'商品名',fieldName:'Name',type:'text'},
        { label:'大項目',fieldName:'Items1__c',type:'text'},
        { label:'小項目',fieldName:'Items2__c',type:'text'},
        { label:'原価',fieldName:'Cost__c',type:'currency'},
        { label:'販売価格',fieldName:'Price__c',type:'currency'},
    ]

    // 見積品目の一覧表示
    @wire ( getProductList, {})
    setQuoteLineItemList( result ) {
        // Apex正常終了の場合
        if ( result.data ) {
            console.log( 'result.data:' + JSON.stringify( result.data ));
            this.GetList = result.data;
        // Apex異常終了の場合
        } else if ( result.error ) {
            console.log( 'result.error:' + JSON.stringify( result.error ));
        }
    }

    @api selectedData;
    selectedData = [];

    handleRowSelection(event) {
        this.selectedData = event.detail.selectedRows;
    }

    @api recordId;
    @wire ( getQuotationConnectRecord, { quotationId: 'recordId' })
    setItem() {
    }

    @api availableActions = [];

    handleNext() {
        console.log('Next button clicked');
        if (this.availableActions.includes('NEXT')) {
            const navigateNextEvent = new FlowNavigationNextEvent();
            console.log('Event dispatched:', navigateNextEvent);
            this.dispatchEvent(navigateNextEvent);
        } else {
            console.warn('NEXT action is not available');
        }
    }
}