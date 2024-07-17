import { LightningElement, api, wire, track } from 'lwc';
import getAllProduct from '@salesforce/apex/GetProduct.getAllProduct';
import GetSelectProduct from '@salesforce/apex/GetProduct.GetSelectProduct';

export default class AddQuotationRecordLWC extends LightningElement {
    @api addQuotationFlag = false;
    @api editQuotationFlag = false;
    connectedCallback() {
        this.addQuotationFlag = true;
    }

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
    @wire (getAllProduct, {})
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

    @api selectedIdList = [];
    handleRowSelection(event) {
        const rowConfig = event.detail.config;
        const selectId = rowConfig.value;
        // console.log('Selected Rows:', rowConfig.action);
        // console.log('Selected Rows:', rowConfig.value);
        if(rowConfig.action == 'rowSelect') {          // 行のチェックボックス:チェック
            // this.selectedIdList.push(selectId);
            this.selectedIdList = [...this.selectedIdList, selectId];
            console.log('追加しました！');
        } else if(rowConfig.action == 'rowDeselect') { // 行のチェックボックス:チェックアウト
            const idx = this.selectedIdList.indexOf(selectId);
            this.selectedIdList.splice( idx, 1 );
            console.log('削除しました！');
        } else {                                       // Allチェックボックス
            // 初期化
            this.selectedIdList.splice(0);
            console.log('全て削除しました！');
            if(rowConfig.action == 'selectAllRows') {
                let rowItem;
                let rowSelect = event.detail.selectedRows;
                // console.log('Selected Rows:', event.detail);
                // console.log('Selected Rows:', rowSelect);
                for(let i = 0 ; i < rowSelect.length ; i++ ){
                    rowItem = rowSelect[i];
                    // this.selectedIdList.push(rowItem.Id);
                    this.selectedIdList = [...this.selectedIdList, rowItem.Id];
                }
                console.log('全て追加しました！');
            }
        }
        console.log(this.selectedIdList[0]);
        console.log(this.selectedIdList[1]);
        console.log(this.selectedIdList);
        console.log('取得データ');
        console.log(this.products);
    }

    @api products;
    @api error;
    handleNext(){
        console.log('クリックできました。');
        this.addQuotationFlag = false;
        this.editQuotationFlag = true;

        GetSelectProduct({ selectIds: this.selectedIdList })
            .then(result => {
                this.products = result;
                this.error = undefined;
            })
            .catch(error => {
                this.error = error;
                this.products = undefined;
            });
    }
}