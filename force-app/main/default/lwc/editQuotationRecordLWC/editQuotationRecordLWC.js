import { LightningElement, api, wire, track } from 'lwc';
import getProductList from '@salesforce/apex/GetAllProduct.getProductList';
import getQuotationConnectRecord from '@salesforce/apex/GetQuotationConnectRecord.getQuotationConnectRecord';

export default class editQuotationRecordLWC extends LightningElement {
    dataList = [];
    columnsDefine = [
        { label:'ID',fieldName:'Id',type:''},
        { label:'商品名',fieldName:'Name',type:'text'},
        { label:'大項目',fieldName:'Items1__c',type:'text'},
        { label:'小項目',fieldName:'Items2__c',type:'text'},
        { label:'原価',fieldName:'Cost__c',type:'currency'},
        { label:'販売価格',fieldName:'Price__c',type:'currency'},
    ]

    @api recordId;

    // 見積品目の一覧表示
    @wire ( getProductList, {})
    setQuoteLineItemList( result ) {
            // Apex正常終了の場合
            if ( result.data ) {
                    console.log( 'result.data:' + JSON.stringify( result.data ));
                    this.dataList = result.data;
            // Apex異常終了の場合
            } else if ( result.error ) {
                    console.log( 'result.error:' + JSON.stringify( result.error ));
            }
    }

	connectedCallback() {
        this.template.addEventListener('navigate', this.handleNavigation.bind(this));
    }

	@track isAnotherComponentVisible = false;
	handleNavigation(event) {
		console.log('親コンポーネントに遷移しました');
        // カスタムイベントのdetailからデータを取得し、必要なアクションを実行
        if (event.detail.componentName === 'anotherComponent') {
            this.isAnotherComponentVisible = true;
        }
    }

    @wire ( getQuotationConnectRecord, { quotationId: 'recordId' })
    setItem() {
    }
}