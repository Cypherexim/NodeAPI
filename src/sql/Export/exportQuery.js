'use strict';

module.exports = {
    get_india_export: `select * from export_data WHERE "Date" BETWEEN $1 AND $2 
    AND ("HSCODE" IN ($3)) OR ("HSCodeDesc" ILIKE $4) 
    OR ("Imp_Name" ILIKE $5) OR ("Exp_Name" ILIKE $6) 
    order by "RecordID" limit 1000000`,
    get_srilanka_export: `select * from export_srilanka WHERE "Date" BETWEEN $1 AND $2 
    AND ("Tariffcode" IN ($3)) AND ("HSCodeDesc" ILIKE $4) 
    or ("Imp_Name" ILIKE $5) or ("Exp_Name" ILIKE $6) 
    order by "RecordID" limit 1000`,
    get_bangladesh_export: `select * from export_bangladesh WHERE "Date" BETWEEN $1 AND $2 
    AND ("HSCODE" IN ($3)) OR ("HSCodeDesc" ILIKE $4) 
    OR ("Imp_Name" ILIKE $5) OR ("Exp_Name" ILIKE $6) 
    order by "RecordID" limit 1000000`,
    get_ethopia_export: `select * from export_ethiopia WHERE "Date" BETWEEN $1 AND $2 
    AND ("HSCODE" IN ($3)) OR ("HSCodeDesc" ILIKE $4) 
    OR ("Consignee_name" ILIKE $5) OR ("shipper_name" ILIKE $6) 
    order by "RecordID" limit 1000000`,
    get_chile_export: `select * from export_chile WHERE "Date" BETWEEN $1 AND $2 
    AND ("HSCODE" IN ($3)) OR ("CommodityDesc" ILIKE $4) 
    OR ("Export_Name" ILIKE $5) 
    order by "RecordID" limit 1000000`,
    get_philip_export: `select * from export_philip WHERE "Date" BETWEEN $1 AND $2 
    AND ("HSCODE" IN ($3)) OR ("CommodityDesc" ILIKE $4) 
    OR ("Importer_Name" ILIKE $5) OR ("Exporter_Name" ILIKE $6) 
    order by "RecordID" limit 1000000`
}