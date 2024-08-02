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

    @AuraEnabled(cacheable=false)
    public static List<Product__c> Items1FilterProduct(String selectItems1) {
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
                Items1__c = :selectItems1
        ];
    }

    @AuraEnabled(cacheable=false)
    public static List<Product__c> Items2FilterProduct(String selectItems2) {
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
            Items2__c = :selectItems2
        ];
    }

    @AuraEnabled(cacheable=false)
    public static List<Product__c> AllFilterProduct(String selectItems1, String selectItems2) {
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
            Items1__c = :selectItems1
            AND
            Items2__c = :selectItems2
        ];
    }

    @AuraEnabled
    public static String addQuotationItem(QuotationItems__c quotationItem) {
        try {
            insert quotationItem;
            return quotationItem.Id;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}