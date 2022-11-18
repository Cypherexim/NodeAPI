'use strict';

module.exports = {
    get_india_import: `select * from import_data WHERE "Date" BETWEEN $1 AND $2 
    AND ("HSCODE" IN ($3)) OR ("HSCodeDesc" ILIKE $4) 
    OR ("Importer_Name" ILIKE $5) OR ("EXPORTER_NAME" ILIKE $6) 
    order by "RecordID" limit 1000000`,
    get_srilanka_import: `select * from import_srilanka WHERE "Date" BETWEEN $1 AND $2 
    AND ("Tariff code" IN ($3)) OR ("HSCodeDesc" ILIKE $4) 
    OR ("Imp_Name" ILIKE $5) OR ("Exp_Name" ILIKE $6) 
    order by "RecordID" limit 1000000`,
    get_bangladesh_import: `select * from import_bangladesh WHERE "Date" BETWEEN $1 AND $2 
    AND ("HSCODE" IN ($3)) OR ("HSCodeDesc" ILIKE $4) 
    OR ("Imp_Name" ILIKE $5) OR ("Exp_Name" ILIKE $6) 
    order by "RecordID" limit 1000000`
}