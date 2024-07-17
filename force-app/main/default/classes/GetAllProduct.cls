public with sharing class GetAllProduct {

    @AuraEnabled(cacheable=true)
    public static List<Product__c> getProductList() {
        return [
            SELECT
                Id,
                Name,
                Items1__c,
                Items2__c,
                Cost__c,
                Price__c
            FROM
                Product__c
        ];
    }
}