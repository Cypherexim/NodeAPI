'use strict';

module.exports = {
    get_import: 'SELECT * FROM public.import_india ORDER BY "RecordID" ASC LIMIT 10000',
    get_import_by_recordId: `SELECT * FROM public.import_india where "RecordID"=$1`,
    get_import_search: `select * from import_india WHERE "Date" BETWEEN $1 AND $2 
    AND ("HSCODE"::text ILIKE $3) OR ("HSCodeDesc" ILIKE $4) 
    OR ("Importer_Name" ILIKE $5) OR ("EXPORTER_NAME" ILIKE $6) 
    order by "RecordID" limit 1000000`,
    add_user: `INSERT INTO public."Cypher"(
        "FullName", "CompanyName", "MobileNumber", "Email", "Password","CountryCode","ParentUserId")
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING public."Cypher"."UserId";`,
    get_user_by_email: `SELECT * FROM public."Cypher" inner join public.userplantransaction on "Cypher"."UserId" = "userplantransaction"."UserId" where "Email"=$1`,
    get_hscode_import: 'SELECT * FROM public.HSCodes',
    get_hscode_export: 'SELECT "Hscode" FROM public."HSCodes"',
    get_hscode_export_digit: 'SELECT "Hscode" FROM public."HSCodes" where length("Hscode") =$1',
    getCountry: 'SELECT * FROM public."Country"',
    get_plan_by_name: `SELECT * FROM public.plan WHERE "PlanName"=$1`,
    add_plan: `INSERT INTO public.plan(
        "PlanName", "Amount", "Validity", "DataAccess", "Downloads", "Searches", "CountryAccess", "CommodityAccess", "TarrifCodeAccess", "Workspace", "WSSLimit", "Downloadfacility", "Favoriteshipment", "Whatstrending", "Companyprofile", "Contactdetails", "Addonfacility", "Analysis", "User")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
    add_Plan_Trasaction: `INSERT INTO public.userplantransaction("UserId", "PlanId", "Downloads", "Searches", "StartDate")
        VALUES ($1, $2, $3, $4, $5)`,
    get_Plan_By_UserId: `SELECT * FROM public.userplantransaction WHERE "UserId"=$1`,
    update_Plan_transaction: `UPDATE public.userplantransaction SET "Searches" = $1 WHERE "UserId"= $2`,

    get_Searches_By_UserId: `SELECT "Downloads","Searches" FROM public.userplantransaction WHERE "UserId"=$1`,

    get_sidefilter_Access: `SELECT * FROM public."SideFilterAccess" where "Country"=$1`,

    get_importer_list: `SELECT DISTINCT "Imp_Name", "Exp_Name" FROM public.import_$1 limit 1000`,
    get_exporter_list: `SELECT DISTINCT "Imp_Name", "Exp_Name" FROM public.export_$1 limit 1000`,

    insert_sidefilter_Access:`INSERT INTO public."SideFilterAccess"(
        "HSCode", "ProductDescription", "ProductDescNative", "Exporter", "Importer", "CountryDestination", "CountryofOrigin", "PortofOrigin", "ShipmentMode", "Unit", "Quantity", "MONTH", "YEAR", "Country", "Import", "Export", "HsProductDescription", "CommodityDesc", "PortofDestination", "LoadingPort", "Currency", "ValueCurrency", "NotifyPartName", "UQC")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24);`,
    update_sidefilter_Access:`UPDATE public."SideFilterAccess"
	SET  "HSCode"=$2, "ProductDescription"=$3, "ProductDescNative"=$4, "Exporter"=$5, "Importer"=$6, "CountryDestination"=$7, "CountryofOrigin"=$8, "PortofOrigin"=$9, "ShipmentMode"=$10, "Unit"=$11, "Quantity"=$12, "MONTH"=$13, "YEAR"=$14, "Import"=$15, "Export"=$16, "HsProductDescription"=$17, "CommodityDesc"=$18, "PortofDestination"=$19, "LoadingPort"=$20, "Currency"=$21, "ValueCurrency"=$22, "NotifyPartName"=$23, "UQC"=$24
	WHERE "Country"=$1;`,
    get_workspace: `SELECT * FROM public.workspace WHERE "UserId"=$1`,

    add_workspace:`INSERT INTO public.workspace(
        "UserId", "Searchbar", "Sidefilter")
        VALUES ($1, $2, $3);`
};
