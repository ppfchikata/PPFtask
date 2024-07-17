public with sharing class GetQuotationConnectRecord {
    @AuraEnabled(cacheable=true)
    public static List<QuotationItems__c> getQuotationConnectRecord(Id quotationId) {
        return [
            SELECT
                Id,
                Name,
                Product2Id__c,
                QuoteId__c,
                Quantity__c,
                ListPrice__c,
                UnitPrice__c
            FROM
                QuotationItems__c
            WHERE
                QuoteId__c = :quotationId
        ];
    }
}