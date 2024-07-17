public with sharing class GetProduct {

    @AuraEnabled(cacheable=true)
    public static List<Product__c> getAllProduct() {
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

    @AuraEnabled(cacheable=false)
    public static List<Product__c> GetSelectProduct(List<Id> selectIds) {
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
            WHERE
                Id
            IN
                :selectIds
        ];
    }
}