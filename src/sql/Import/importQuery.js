'use strict';

module.exports = {
    get_india_import: `select * from import_data WHERE "Date" BETWEEN $1 AND $2 
    AND ("HSCODE" IN ($3)) OR ("HSCodeDesc" ILIKE $4) 
    OR ("Importer_Name" ILIKE $5) OR ("EXPORTER_NAME" ILIKE $6) 
    order by "RecordID" limit 1000000`
}