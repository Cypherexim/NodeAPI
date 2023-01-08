'use strict';

module.exports = {
    get_india_export_pagination: `select * from export_india WHERE "Date" BETWEEN $1 AND $2 
    AND ("HSCODE" IN ($3)) OR ("HSCodeDesc" ILIKE $4) 
    OR ("Imp_Name" ILIKE $5) OR ("Exp_Name" ILIKE $6) 
    LIMIT $7 OFFSET $8`,
    get_india_export: `select * from export_india WHERE "Date" BETWEEN $1 AND $2 
    AND ("HSCODE" IN ($3)) OR ("HSCodeDesc" ILIKE $4) 
    OR ("Imp_Name" ILIKE $5) OR ("Exp_Name" ILIKE $6) limit 500000`,
    get_srilanka_export_pagination: `select * from export_srilanka WHERE "Date" BETWEEN $1 AND $2 
    AND ("HsCode" IN ($3)) AND ("ProductDesc" ILIKE $4) 
    or ("Imp_Name" ILIKE $5) or ("Exp_Name" ILIKE $6) 
    LIMIT $7 OFFSET $8`,
    get_srilanka_export: `select * from export_srilanka WHERE "Date" BETWEEN $1 AND $2 
    AND ("HsCode" IN ($3)) AND ("ProductDesc" ILIKE $4) 
    or ("Imp_Name" ILIKE $5) or ("Exp_Name" ILIKE $6) 
    limit 500000`,
    get_bangladesh_export: `select * from export_bangladesh WHERE "Date" BETWEEN $1 AND $2 
    AND ("HSCODE" IN ($3)) OR ("HSCodeDesc" ILIKE $4) 
    OR ("Imp_Name" ILIKE $5) OR ("Exp_Name" ILIKE $6) 
    LIMIT $7 OFFSET $8`,
    get_ethopia_export: `select * from export_ethiopia WHERE "Date" BETWEEN $1 AND $2 
    AND ("HsCode" IN ($3)) OR ("ProductDesc" ILIKE $4) 
    OR ("Imp_Name" ILIKE $5) OR ("Exp_Name" ILIKE $6) 
    LIMIT $7 OFFSET $8`,
    get_chile_export: `select * from export_chile WHERE "Date" BETWEEN $1 AND $2 
    AND ("HsCode" IN ($3)) OR ("ProductDesc" ILIKE $4) 
    OR ("Exp_Name" ILIKE $5) 
    LIMIT $7 OFFSET $8`,
    get_philip_export_pagination: `select * from export_philip WHERE "Date" BETWEEN $1 AND $2 
    AND ("HsCode" IN ($3)) OR ("ProductDesc" ILIKE $4) 
    OR ("Imp_Name" ILIKE $5) OR ("Exp_Name" ILIKE $6) 
    LIMIT $7 OFFSET $8`,
    get_philip_export: `select * from export_philip WHERE "Date" BETWEEN $1 AND $2 
    AND ("HsCode" IN ($3)) OR ("ProductDesc" ILIKE $4) 
    OR ("Imp_Name" ILIKE $5) OR ("Exp_Name" ILIKE $6) 
    limit 500000`
}