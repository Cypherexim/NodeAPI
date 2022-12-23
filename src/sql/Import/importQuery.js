'use strict';

module.exports = {
    get_india_import: `select * from import_india WHERE "Date" BETWEEN $1 AND $2 
    AND ("HSCODE" IN ($3)) OR ("HSCodeDesc" ILIKE $4) 
    OR ("Imp_Name" ILIKE $5) OR ("Exp_Name" ILIKE $6) 
    order by "RecordID" limit 1000000`,
    get_srilanka_import: `select * from import_srilanka WHERE "Date" BETWEEN $1 AND $2 
    AND ("Tariff code" IN ($3)) OR ("HSCodeDesc" ILIKE $4) 
    OR ("Imp_Name" ILIKE $5) OR ("Exp_Name" ILIKE $6) 
    order by "RecordID" limit 1000000`,
    get_bangladesh_import: `select * from import_bangladesh WHERE "Date" BETWEEN $1 AND $2 
    AND ("HSCODE" IN ($3)) OR ("HSCodeDesc" ILIKE $4) 
    OR ("Imp_Name" ILIKE $5) OR ("Exp_Name" ILIKE $6) 
    order by "RecordID" limit 1000000`,
    get_ethiopia_import: `select * from import_ethiopia WHERE "Date" BETWEEN $1 AND $2 
    AND ("HSCODE" IN ($3)) OR ("ProductDesc" ILIKE $4) 
    OR ("Imp_Name" ILIKE $5) 
    order by "RecordID" limit 1000000`,
    get_chile_import: `select * from import_chile WHERE "Date" BETWEEN $1 AND $2 
    AND ("HSCODE" IN ($3)) OR ("CommodityDesc" ILIKE $4) 
    OR ("Imp_Name" ILIKE $5) OR ("Exp_Name" ILIKE $6) 
    order by "RecordID" limit 1000000`,
    get_philip_import: `select * from import_philip WHERE "Date" BETWEEN $1 AND $2 
    AND ("HSCODE" IN ($3)) OR ("CommodityDesc" ILIKE $4) 
    OR ("Imp_Name" ILIKE $5) OR ("Exp_Name" ILIKE $6) 
    order by "RecordID" limit 1000000`
}