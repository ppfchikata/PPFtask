import { LightningElement, api, wire, track } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { CloseActionScreenEvent } from 'lightning/actions';
import getAllProduct from '@salesforce/apex/GetProduct.getAllProduct';
import GetSelectProduct from '@salesforce/apex/GetProduct.GetSelectProduct';
import Items1FilterProduct from '@salesforce/apex/GetProduct.Items1FilterProduct';
import Items2FilterProduct from '@salesforce/apex/GetProduct.Items2FilterProduct';
import AllFilterProduct from '@salesforce/apex/GetProduct.AllFilterProduct';
import AddQuotationItem from '@salesforce/apex/GetProduct.addQuotationItem';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import PRODUCT_ITEMS1_FIELD from '@salesforce/schema/Product__c.Items1__c';
import PRODUCT_ITEMS2_FIELD from '@salesforce/schema/Product__c.Items2__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class AddQuotationRecordLWC extends LightningElement {
    // ---画面表示処理---
    @api addQuotationFlag = false;
    @api editQuotationFlag = false;
    @api validationErrorFlag = false;
    connectedCallback() {
        this.addQuotationFlag = true;
    }

    // ---商品を追加---
    // 表示データ定義
    @api GetList;
    GetList = [];
    columnsDefineList = [
        { label:'商品名',fieldName:'Name',type:'text'},
        { label:'大項目',fieldName:'Items1__c',type:'text'},
        { label:'小項目',fieldName:'Items2__c',type:'text'},
        { label:'原価',fieldName:'Cost__c',type:'currency'},
        { label:'販売価格',fieldName:'Price__c',type:'currency'},
    ]
    columnsDefineEdit = [
        { label:'商品名',fieldName:'Name',type:'text'},
        { label:'原価',fieldName:'Cost__c',type:'currency'},
        { label:'販売価格',fieldName:'UnitPrice__c',type:'currency',editable: true},
        { label:'数量',fieldName:'Quantity__c',type:'Number',editable: true},
        { label:'小計',fieldName:'Subtotal__c',type:'currency'},
        {
            type: 'button',
            typeAttributes: {
                label: 'Delete',
                name: 'delete',
                disabled: false,
                value: 'delete'
            }
        }
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

    // ---選択リスト---
    items1PicklistOptions;
    items2PicklistOptions;
    items1SelectedValue = '';
    items2SelectedValue = '';

    @wire(getObjectInfo, { objectApiName: 'Product__c' })
    objectInfo;

    // 選択リストの項目設定：items1
    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: PRODUCT_ITEMS1_FIELD })
    wiredItems1PicklistValues({ error, data }) {
        if (data) {
            this.items1PicklistOptions = [
                { label: '全て', value: '' },
                ...data.values.map(value => {
                    return { label: value.label, value: value.value };
                })
            ];
        } else if (error) {
            console.error('Error fetching picklist values', error);
        }
    }

    // 選択リストの項目設定：items2
    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: PRODUCT_ITEMS2_FIELD })
    wiredItems2PicklistValues({ error, data }) {
        if (data) {
            this.items2PicklistOptions = [
                { label: '全て', value: '' },
                ...data.values.map(value => {
                    return { label: value.label, value: value.value };
                })
            ];
        } else if (error) {
            console.error('Error fetching picklist values', error);
        }
    }

    // 選択リストの選択時処理：items1
    items1HandleChange(event) {
        // バリデーションエラー非表示
        this.validationErrorFlag = false;
        // 選択された値を更新
        this.items1SelectedValue = event.detail.value;
        this.FilterProducts();
    }

    // 選択リストの選択時処理：items2
    items2HandleChange(event) {
        // バリデーションエラー非表示
        this.validationErrorFlag = false;
        // 選択された値を更新
        this.items2SelectedValue = event.detail.value;
        this.FilterProducts();
    }

    // 商品をフィルタリングして返却
    FilterProducts() {
        if (this.items1SelectedValue && this.items2SelectedValue) {             // 大項目・小項目選択時
            AllFilterProduct({ selectItems1: this.items1SelectedValue, selectItems2: this.items2SelectedValue })
                .then(result => {
                    this.GetList = result;
                    this.error = undefined;
                })
                .catch(error => {
                    this.error = error;
                    this.GetList = undefined;
                });
        } else if (this.items1SelectedValue && !this.items2SelectedValue) {     // 大項目のみ選択時
            Items1FilterProduct({ selectItems1: this.items1SelectedValue })
                .then(result => {
                    this.GetList = result;
                    this.error = undefined;
                })
                .catch(error => {
                    this.error = error;
                    this.GetList = undefined;
                });
        } else if (!this.items1SelectedValue && this.items2SelectedValue) {     // 小項目のみ選択時
            Items2FilterProduct({ selectItems2: this.items2SelectedValue })
                .then(result => {
                    this.GetList = result;
                    this.error = undefined;
                })
                .catch(error => {
                    this.error = error;
                    this.GetList = undefined;
                });
        } else if (!this.items1SelectedValue && !this.items2SelectedValue) {    // 選択なし
            getAllProduct()
                .then(result => {
                    this.GetList = result;
                    this.error = undefined;
                })
                .catch(error => {
                    this.error = error;
                    this.GetList = undefined;
                });
        }
    }

    // ---チェックボックス選択処理---
    @track selectedIdList = [];
    handleCheckSelection(event) {
        const rowConfig = event.detail.config;
        const selectId = rowConfig.value;
        if(rowConfig.action == 'rowSelect') {          // 行のチェックボックス:チェック
            this.selectedIdList = [...this.selectedIdList, selectId];
        } else if(rowConfig.action == 'rowDeselect') { // 行のチェックボックス:チェックアウト
            const idx = this.selectedIdList.indexOf(selectId);
            this.selectedIdList.splice( idx, 1 );
        } else {                                       // Allチェックボックス
            // 初期化
            this.selectedIdList.splice(0);
            if(rowConfig.action == 'selectAllRows') {
                let rowItem;
                let rowSelect = event.detail.selectedRows;
                for(let i = 0 ; i < rowSelect.length ; i++ ){
                    rowItem = rowSelect[i];
                    this.selectedIdList = [...this.selectedIdList, rowItem.Id];
                }
            }
        }
    }

    // ---Nextボタン押下---
    @api products;
    @api error;
    handleNext(){
        if(this.selectedIdList[0]) {
            // 画面の表示切替
            this.addQuotationFlag = false;
            this.editQuotationFlag = true;
            this.validationErrorFlag = false;

            // 選択データを取得
            GetSelectProduct({ selectIds: this.selectedIdList })
                .then(result => {
                    result = this.addDefaultData(result);
                    this.products = result;
                    this.error = undefined;
                })
                .catch(error => {
                    this.error = error;
                    this.products = undefined;
                });

            // チェックを初期化
            this.selectedIdList = [];
        } else {
            // バリデーションエラー表示
            this.validationErrorFlag = true;
        }
    }

    // 選択データにデフォルト値を追加
    addDefaultData(result) {
        try{
            // デフォルト値を追加
            const unitPriceField = 'UnitPrice__c';
            const quantityField = 'Quantity__c';
            const subtotalField = 'Subtotal__c';
            result = result.map(row => {
                row[unitPriceField] = row.Price__c;
                row[quantityField] = 1;
                row[subtotalField] = row.Price__c * row[quantityField];
                return row;
            });
            return result;
        } catch (error) {
            console.error("Message:", error.message);
            console.error("Stack:", error.stack);
        }
    }

    // インライン編集イベント
    @api draftValues = [];
    handleCellChange(event) {
        try{
        // イベントを取得
        this.draftValues = event.detail.draftValues;
        this.draftValues.forEach(draft => {
            const Id = draft.Id;
            // 入力値のみを取得
            const updatedFields = Object.keys(draft).filter(key => key !== 'Id');
            // 入力値に置き換えて返却
            updatedFields.forEach(field => {
                const newValue = draft[field];
                let cloneValue = this.products;
                cloneValue = cloneValue.map(row => {
                    if (row.Id === Id) {
                        return {...row, [field]: newValue};
                    }
                    return row;
                });
                this.products = cloneValue;
            });
        });
        this.products = [...this.products];
        } catch (error) {
            console.error("Message:", error.message);
            console.error("Stack:", error.stack);
        }
        this.draftValues = [];
    }

    // Deleteボタン押下イベント
    handleDeleteSelection(event) {
        // イベントを取得
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        // アクション毎に処理を実行
        switch (actionName) {
            case 'delete':
                this.deleteRow(row);
                break;
            default:
        }
    }

    // 行の削除
    deleteRow(row) {
        // 行の削除
        this.products = this.products.filter(item => item.Id !== row.Id);
        // 行が無くなった場合は前の画面に戻る
        if(!this.products[0]) {
            this.handleBack();
        }
    }

    // 商品追加画面へ戻るイベント
    handleBack(){
        this.addQuotationFlag = true;
        this.editQuotationFlag = false;
    }

    // 見積品目名アップロード項目
    @track quotationItem = {
        CostPrice__c: 0,
        Subtotal__c: 0,
        Quantity__c: 0,
        DefaultPrice__c: 0,
        QuoteId__c: '',
        Product2Id__c: '',
        UnitPrice__c: 0
    };

    // recordIdを取得
    @wire(CurrentPageReference)
    currentPageReference;

    // 保存イベント
    handleSave(){
        try{
            // 行ごとに処理
            this.products.forEach((element) => {
                // 値を設定
                this.quotationItem.QuoteId__c = this.currentPageReference?.state?.recordId;
                this.quotationItem.Product2Id__c = element.Id;
                this.quotationItem.CostPrice__c = element.Cost__c;
                this.quotationItem.Subtotal__c = element.Subtotal__c;
                this.quotationItem.Quantity__c = element.Quantity__c;
                this.quotationItem.DefaultPrice__c = element.Price__c;
                this.quotationItem.UnitPrice__c = element.UnitPrice__c;
                // 商品を追加
                AddQuotationItem({ quotationItem: this.quotationItem })
                    .then(result => {
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: '成功',
                                message: '商品を追加しました: ' + result,
                                variant: 'success',
                            }),
                        );
                    })
                    .catch(error => {
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: 'エラー',
                                message: error.body.message,
                                variant: 'error',
                            }),
                        );
                    });
            });
            // 商品追加画面を閉じる
            this.dispatchEvent(new CloseActionScreenEvent());

            // 数秒待ってからページをリロード
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error("Message:", error.message);
            console.error("Stack:", error.stack);
        }
    }
}