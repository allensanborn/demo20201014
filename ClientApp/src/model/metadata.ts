export class LineOfCreditMetadata {
    public static value = {"structuralTypes":[{"shortName":"Client","namespace":"Models","autoGeneratedKeyType":"Identity","defaultResourceName":"Clients","isComplexType":false,"dataProperties":[{"dataType":"Int32","isPartOfKey":true,"isNullable":false,"nameOnServer":"ClientId","validators":[{"name":"required"},{"name":"int32"}]},{"dataType":"Int32","isNullable":true,"nameOnServer":"CreditorId","validators":[{"name":"int32"}]},{"dataType":"String","isNullable":false,"maxLength":100,"nameOnServer":"FirstName","validators":[{"name":"required"},{"maxLength":100,"name":"maxLength"}]},{"dataType":"String","isNullable":false,"maxLength":100,"nameOnServer":"LastName","validators":[{"name":"required"},{"maxLength":100,"name":"maxLength"}]},{"dataType":"Binary","isNullable":true,"concurrencyMode":"Fixed","nameOnServer":"Timestamp","validators":[]}],"navigationProperties":[]},{"shortName":"Creditor","namespace":"Models","autoGeneratedKeyType":"Identity","defaultResourceName":"Creditors","isComplexType":false,"dataProperties":[{"dataType":"Int32","isPartOfKey":true,"isNullable":false,"nameOnServer":"CreditorId","validators":[{"name":"required"},{"name":"int32"}]},{"dataType":"String","isNullable":false,"maxLength":100,"nameOnServer":"Name","validators":[{"name":"required"},{"maxLength":100,"name":"maxLength"}]},{"dataType":"Binary","isNullable":true,"concurrencyMode":"Fixed","nameOnServer":"Timestamp","validators":[]}],"navigationProperties":[{"entityTypeName":"Client:#Models","isScalar":false,"associationName":"Inv_Models.Creditor_Models.Client_Clients","invForeignKeyNamesOnServer":["CreditorId"],"nameOnServer":"Clients","validators":[]}]},{"shortName":"LineOfCredit","namespace":"Models","autoGeneratedKeyType":"Identity","defaultResourceName":"LinesOfCredit","isComplexType":false,"dataProperties":[{"dataType":"Int32","isPartOfKey":true,"isNullable":false,"nameOnServer":"LineOfCreditId","validators":[{"name":"required"},{"name":"int32"}]},{"dataType":"Decimal","isNullable":false,"nameOnServer":"Balance","validators":[{"name":"required"},{"name":"number"}]},{"dataType":"Int32","isNullable":false,"nameOnServer":"ClientId","validators":[{"name":"required"},{"name":"int32"}]},{"dataType":"Int32","isNullable":false,"nameOnServer":"CreditorId","validators":[{"name":"required"},{"name":"int32"}]},{"dataType":"Decimal","isNullable":false,"nameOnServer":"MinPaymentPercentage","validators":[{"name":"required"},{"name":"number"}]},{"dataType":"Binary","isNullable":true,"concurrencyMode":"Fixed","nameOnServer":"Timestamp","validators":[]}],"navigationProperties":[{"entityTypeName":"Client:#Models","isScalar":true,"associationName":"Models.LineOfCredit_Models.Client_Client","foreignKeyNamesOnServer":["ClientId"],"nameOnServer":"Client","validators":[]},{"entityTypeName":"Creditor:#Models","isScalar":true,"associationName":"Models.LineOfCredit_Models.Creditor_Creditor","foreignKeyNamesOnServer":["CreditorId"],"nameOnServer":"Creditor","validators":[]}]}]}
;
}