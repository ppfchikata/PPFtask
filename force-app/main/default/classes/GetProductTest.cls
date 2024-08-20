@isTest
public class GetProductTest {
    @isTest
    static void testItems1FilterProduct() {
        // 準備
        String selectItems1 = '生鮮食品';
        List<String> items1Options = new List<String>{'生鮮食品', '加工食品', '冷凍食品', '飲料食品','生活雑貨'};
        List<String> items2Options = new List<String>{'果物', '加工', '冷凍生鮮食品', 'ノンアルコール飲料','掃除用品'};
        List<Product__c> testProducts = new List<Product__c>();
        for (Integer i = 0; i < 5; i++) {
            Product__c product = new Product__c(
                Name = 'Test Product ' + i,
                Items1__c = items1Options[i],
                Items2__c = items2Options[i],
                Cost__c = 100,
                Price__c = 200
            );
            testProducts.add(product);
        }
        insert testProducts;
        // 実行
        Test.startTest();
        List<Product__c> result = GetProduct.Items1FilterProduct(selectItems1);
        Test.stopTest();
        // 検証
        System.assertEquals(5, result.size(), 'The number of products returned should be 5');
        for (Product__c product : result) {
            System.assertEquals(selectItems1, product.Items1__c, 'Items1__c should match the selected value');
        }
    }

    @isTest
    static void testItems2FilterProduct() {
        // 準備
        String selectItems2 = '果物';
        List<String> items1Options = new List<String>{'生鮮食品', '加工食品', '冷凍食品', '飲料食品','生活雑貨'};
        List<String> items2Options = new List<String>{'果物', '加工', '冷凍生鮮食品', 'ノンアルコール飲料','掃除用品'};
        List<Product__c> testProducts = new List<Product__c>();
        for (Integer i = 0; i < 5; i++) {
            Product__c product = new Product__c(
                Name = 'Test Product ' + i,
                Items1__c = items1Options[i],
                Items2__c = items2Options[i],
                Cost__c = 100,
                Price__c = 200
            );
            testProducts.add(product);
        }
        insert testProducts;
        // 実行
        Test.startTest();
        List<Product__c> result = GetProduct.Items2FilterProduct(selectItems2);
        Test.stopTest();
        // 検証
        System.assertEquals(5, result.size(), 'The number of products returned should be 5');
        for (Product__c product : result) {
            System.assertEquals(selectItems2, product.Items2__c, 'Items2__c should match the selected value');
        }
    }

    @isTest
    static void testAllFilterProduct() {
        // 準備
        String selectItems1 = '生鮮食品';
        String selectItems2 = '果物';
        List<String> items1Options = new List<String>{'生鮮食品', '加工食品', '冷凍食品', '飲料食品','生活雑貨'};
        List<String> items2Options = new List<String>{'果物', '加工', '冷凍生鮮食品', 'ノンアルコール飲料','掃除用品'};
        List<Product__c> testProducts = new List<Product__c>();
        for (Integer i = 0; i < 5; i++) {
            Product__c product = new Product__c(
                Name = 'Test Product ' + i,
                Items1__c = items1Options[i],
                Items2__c = items2Options[i],
                Cost__c = 100,
                Price__c = 200
            );
            testProducts.add(product);
        }
        insert testProducts;
        // 実行
        Test.startTest();
        List<Product__c> result = GetProduct.AllFilterProduct(selectItems1, selectItems2);
        Test.stopTest();
        // 検証
        System.assertEquals(5, result.size(), 'The number of products returned should be 5');
        for (Product__c product : result) {
            System.assertEquals(selectItems1, product.Items1__c, 'Items1__c should match the selected value');
            System.assertEquals(selectItems2, product.Items2__c, 'Items2__c should match the selected value');
        }
    }

    @isTest
    static void testGetAllProduct() {
        // 準備
        List<Product__c> testProducts = new List<Product__c>();
        for (Integer i = 0; i < 5; i++) {
            Product__c product = new Product__c(
                Name = 'テスト商品 ' + i,
                Items1__c = '生鮮食品',
                Items2__c = '果物',
                Cost__c = 100,
                Price__c = 200
            );
            testProducts.add(product);
        }
        insert testProducts;

        // 実行
        Test.startTest();
        List<Product__c> result = GetProduct.getAllProduct();
        Test.stopTest();

        // 検証
        System.assertEquals(5, result.size(), '返された商品の数は5であるべきです');
        for (Product__c product : result) {
            System.assertNotEquals(null, product.Id, '商品IDはnullであってはいけません');
            System.assertNotEquals(null, product.Name, '商品名はnullであってはいけません');
            System.assertNotEquals(null, product.Items1__c, 'Items1__cはnullであってはいけません');
            System.assertNotEquals(null, product.Items2__c, 'Items2__cはnullであってはいけません');
            System.assertNotEquals(null, product.Cost__c, '原価はnullであってはいけません');
            System.assertNotEquals(null, product.Price__c, '価格はnullであってはいけません');
        }
    }

    @isTest
    static void testGetSelectProduct() {
        // 準備
        List<Product__c> testProducts = new List<Product__c>();
        List<Id> selectIds = new List<Id>();
        for (Integer i = 0; i < 5; i++) {
            Product__c product = new Product__c(
                Name = 'テスト商品 ' + i,
                Items1__c = '生鮮食品',
                Items2__c = '果物',
                Cost__c = 100,
                Price__c = 200
            );
            testProducts.add(product);
        }
        insert testProducts;

        for (Product__c product : testProducts) {
            selectIds.add(product.Id);
        }

        // 実行
        Test.startTest();
        List<Product__c> result = GetProduct.GetSelectProduct(selectIds);
        Test.stopTest();

        // 検証
        System.assertEquals(5, result.size(), '返された商品の数は5であるべきです');
        for (Product__c product : result) {
            System.assert(selectIds.contains(product.Id), '返された商品のIDは選択されたIDのリストに含まれているべきです');
            System.assertNotEquals(null, product.Name, '商品名はnullであってはいけません');
            System.assertNotEquals(null, product.Items1__c, 'Items1__cはnullであってはいけません');
            System.assertNotEquals(null, product.Items2__c, 'Items2__cはnullであってはいけません');
            System.assertNotEquals(null, product.Cost__c, '原価はnullであってはいけません');
            System.assertNotEquals(null, product.Price__c, '価格はnullであってはいけません');
        }
    }

    @isTest
    static void testAddQuotationItem() {
        // テストデータの準備
        QuotationItems__c testQuotationItem = new QuotationItems__c(
            QuoteId__c = 'a045g00000IzYXMAA3',
            Product2Id__c = 'a03J1000001WvGJIA0',
            CostPrice__c = 1000,
            Subtotal__c = 2000,
            Quantity__c = 2,
            DefaultPrice__c = 1000,
            UnitPrice__c = 1000
        );

        // テストの実行
        Test.startTest();
        String result = GetProduct.addQuotationItem(testQuotationItem);
        Test.stopTest();

        // 結果の検証
        System.assertNotEquals(null, result, '返されたIDはnullであってはいけません');

        // データベースに挿入されたレコードの検証
        QuotationItems__c insertedItem = [SELECT Id, CostPrice__c, Subtotal__c, Quantity__c, DefaultPrice__c, UnitPrice__c FROM QuotationItems__c WHERE Id = :result];
        System.assertEquals(testQuotationItem.CostPrice__c, insertedItem.CostPrice__c, '原価が正しく保存されていません');
        System.assertEquals(testQuotationItem.Subtotal__c, insertedItem.Subtotal__c, '小計が正しく保存されていません');
        System.assertEquals(testQuotationItem.Quantity__c, insertedItem.Quantity__c, '数量が正しく保存されていません');
        System.assertEquals(testQuotationItem.DefaultPrice__c, insertedItem.DefaultPrice__c, 'デフォルト価格が正しく保存されていません');
        System.assertEquals(testQuotationItem.UnitPrice__c, insertedItem.UnitPrice__c, '単価が正しく保存されていません');
    }

    @isTest
    static void testAddQuotationItemException() {
        // 無効なデータを準備（必須フィールドを空にする）
        QuotationItems__c invalidQuotationItem = new QuotationItems__c();

        // テストの実行
        Test.startTest();
        try {
            GetProduct.addQuotationItem(invalidQuotationItem);
            System.assert(false, '例外が発生するはずです');
        } catch (AuraHandledException e) {
            // 例外が発生することを確認
            System.assert(true, '予期された例外が発生しました');
        }
        Test.stopTest();
    }
}