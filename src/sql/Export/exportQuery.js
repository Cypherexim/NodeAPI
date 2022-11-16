'use strict';

module.exports = {
    get_india_export: `select * from export_data WHERE "Date" BETWEEN $1 AND $2 
    AND ("HSCODE" IN ($3)) OR ("HSCodeDesc" ILIKE $4) 
    OR ("Imp_Name" ILIKE $5) OR ("Exp_Name" ILIKE $6) 
    order by "RecordID" limit 1000000`
}