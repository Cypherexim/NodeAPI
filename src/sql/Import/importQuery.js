'use strict';

module.exports = {
    get_india_import_pagination: `select * from import_india WHERE "Date" BETWEEN $1 AND $2 
    AND ("HSCODE" IN ($3)) OR ("HSCodeDesc" ILIKE $4) 
    OR ("Imp_Name" ILIKE $5) OR ("Exp_Name" ILIKE $6) 
    LIMIT $7 OFFSET $8`,
    get_india_import: `select * from import_india WHERE "Date" BETWEEN $1 AND $2 
    AND ("HSCODE" IN ($3)) OR ("HSCodeDesc" ILIKE $4) 
    OR ("Imp_Name" ILIKE $5) OR ("Exp_Name" ILIKE $6) 
    LIMIT 1000`,
    get_srilanka_import_pagination: `select * from import_srilanka WHERE "Date" BETWEEN $1 AND $2 
    AND ("HsCode" IN ($3)) OR ("ProductDesc" ILIKE $4) 
    OR ("Imp_Name" ILIKE $5) OR ("Exp_Name" ILIKE $6) 
    LIMIT $7 OFFSET $8`,
    get_srilanka_import: `select * from import_srilanka WHERE "Date" BETWEEN $1 AND $2 
    AND ("HsCode" IN ($3)) OR ("ProductDesc" ILIKE $4) 
    OR ("Imp_Name" ILIKE $5) OR ("Exp_Name" ILIKE $6) 
    LIMIT 1000`,
    get_bangladesh_import_pagination: `select * from import_bangladesh WHERE "Date" BETWEEN $1 AND $2 
    AND ("HSCODE" IN ($3)) OR ("HSCodeDesc" ILIKE $4) 
    OR ("Imp_Name" ILIKE $5) OR ("Exp_Name" ILIKE $6) 
    LIMIT $7 OFFSET $8`,
    get_bangladesh_import: `select * from import_bangladesh WHERE "Date" BETWEEN $1 AND $2 
    AND ("HSCODE" IN ($3)) OR ("HSCodeDesc" ILIKE $4) 
    OR ("Imp_Name" ILIKE $5) OR ("Exp_Name" ILIKE $6) 
    LIMIT 1000`,
    get_ethiopia_import_pagination: `select * from import_ethiopia WHERE "Date" BETWEEN $1 AND $2 
    AND ("HsCode" IN ($3)) OR ("ProductDesc" ILIKE $4) 
    OR ("Imp_Name" ILIKE $5) 
    LIMIT $7 OFFSET $8`,
    get_ethiopia_import: `select * from import_ethiopia WHERE "Date" BETWEEN $1 AND $2 
    AND ("HsCode" IN ($3)) OR ("ProductDesc" ILIKE $4) 
    OR ("Imp_Name" ILIKE $5) 
    LIMIT 1000`,
    get_chile_import_pagination: `select * from import_chile WHERE "Date" BETWEEN $1 AND $2 
    AND ("HsCode" IN ($3)) OR ("ProductDesc" ILIKE $4) 
    OR ("Imp_Name" ILIKE $5) OR ("Exp_Name" ILIKE $6) 
    LIMIT $7 OFFSET $8`,
    get_chile_import: `select * from import_chile WHERE "Date" BETWEEN $1 AND $2 
    AND ("HsCode" IN ($3)) OR ("ProductDesc" ILIKE $4) 
    OR ("Imp_Name" ILIKE $5) OR ("Exp_Name" ILIKE $6) 
    LIMIT 1000`,
    get_philip_import_pagination: `select * from import_philip WHERE "Date" BETWEEN $1 AND $2 
    AND ("HsCode" IN ($3)) OR ("ProductDesc" ILIKE $4) 
    OR ("Imp_Name" ILIKE $5) OR ("Exp_Name" ILIKE $6) 
    LIMIT $7 OFFSET $8`,
    get_philip_import: `select * from import_philip WHERE "Date" BETWEEN $1 AND $2 
    AND ("HsCode" IN ($3)) OR ("ProductDesc" ILIKE $4) 
    OR ("Imp_Name" ILIKE $5) OR ("Exp_Name" ILIKE $6) 
    LIMIT 1000`,

    get_india_paging_records:`SELECT * FROM public.import_india LIMIT $1 OFFSET $2`
}