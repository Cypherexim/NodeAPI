'use strict';

module.exports = {
    get_import: 'SELECT * FROM public.import_data ORDER BY "RecordID" ASC LIMIT 10000',
    get_import_by_recordId: `SELECT * FROM public.import_data where "RecordID"=$1`,
    get_import_search: `select * from import_data WHERE "Date" BETWEEN $1 AND $2 
    AND ("HSCODE"::text ILIKE $3) OR ("HSCodeDesc" ILIKE $4) 
    OR ("Importer_Name" ILIKE $5) OR ("EXPORTER_NAME" ILIKE $6) 
    order by "RecordID" limit 1000000`,
    add_user: `INSERT INTO public."Cypher"(
        "FullName", "CompanyName", "MobileNumber", "Email", "Password","CountryCode")
        VALUES ($1, $2, $3, $4, $5, $6);`,
    get_user_by_email: `SELECT * FROM public."Cypher" where "Email"=$1;`,
    get_hscode_import: 'SELECT * FROM public.HSCodes',
    get_hscode_export: 'SELECT "Hscode" FROM public."HSCodes"',
    getCountry:'SELECT * FROM public."Country"'
};
