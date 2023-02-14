'use strict';

module.exports = {
    get_import: 'SELECT * FROM public.import_india ORDER BY "RecordID" ASC LIMIT 10000',
    get_import_by_recordId: `SELECT * FROM public.import_india where "RecordID"=$1`,
    get_import_search: `select * from import_india WHERE "Date" BETWEEN $1 AND $2 
    AND ("HSCODE"::text ILIKE $3) OR ("HSCodeDesc" ILIKE $4) 
    OR ("Importer_Name" ILIKE $5) OR ("EXPORTER_NAME" ILIKE $6) 
    order by "RecordID" limit 1000000`,
    add_user_by_admin: `INSERT INTO public."Cypher"(
        "FullName", "CompanyName", "MobileNumber", "Email", "Password","CountryCode","ParentUserId")
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING public."Cypher"."UserId";`,
    add_user: `INSERT INTO public."Cypher"(
        "FullName", "CompanyName", "MobileNumber", "Email", "Password", "CountryCode", "ParentUserId", "Designation", "Location", "GST", "IEC","RoleId")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING public."Cypher"."UserId";;`,
    get_user_by_email: `SELECT *,("EndDate"- now()::date) AS Remainingdays FROM public."Cypher" inner join public.userplantransaction on "Cypher"."UserId" = "userplantransaction"."UserId" inner join public.plan on "userplantransaction"."PlanId" = "plan"."PlanId" inner join "Role" on "Cypher"."RoleId" = "Role"."RoleId"
    where "Email"=$1`,
    get_hscode_import: 'SELECT * FROM public.HSCodes',
    get_hscode_export: 'SELECT "Hscode","HscodeDesc" FROM public."HSCodes"',
    get_hscode_export_digit: 'SELECT "Hscode" ,"HscodeDesc" FROM public."HSCodes" where length("Hscode") =$1',
    getCountry: 'SELECT * FROM public."Country"',
    get_plan_by_name: `SELECT * FROM public.plan WHERE "PlanName"=$1`,
    add_plan: `INSERT INTO public.plan(
        "PlanName", "Amount", "Validity", "DataAccess", "Downloads", "Searches", "CountryAccess", "CommodityAccess", "TarrifCodeAccess", "Workspace", "WSSLimit", "Downloadfacility", "Favoriteshipment", "Whatstrending", "Companyprofile", "Contactdetails", "Addonfacility", "Analysis", "User")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
    get_plan_list: `SELECT * FROM public.plan`,
    update_plan: `UPDATE public.plan
	SET "PlanName"=$1, "Amount"=$2, "Validity"=$3, "DataAccess"=$4, "Downloads"=$5, "Searches"=$6, "CountryAccess"=$7, 
    "CommodityAccess"=$8, "TarrifCodeAccess"=$9, "Workspace"=$10, "WSSLimit"=$11, "Downloadfacility"=$12, "Favoriteshipment"=$13, 
    "Whatstrending"=$14, "Companyprofile"=$15, "Contactdetails"=$16, "Addonfacility"=$17, "Analysis"=$18, "User"=$19
	WHERE "PlanId"=$20;`,
    add_Plan_Trasaction: `INSERT INTO public.userplantransaction("UserId", "PlanId", "Downloads", "Searches", "StartDate")
        VALUES ($1, $2, $3, $4, $5)`,
    add_Plan_Trasaction_by_admin: `INSERT INTO public.userplantransaction(
        "UserId", "PlanId", "Downloads", "Searches", "StartDate", "EndDate", "Validity", "DataAccess", "CountryAccess", "CommodityAccess", "TarrifCodeAccess", "Workspace", "WSSLimit", "Downloadfacility", "Favoriteshipment", "Whatstrending", "Companyprofile", "Addonfacility", "Analysis", "User")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20);`,
    get_Plan_By_UserId: `SELECT * FROM public.userplantransaction WHERE "UserId"=$1`,
    update_Plan_transaction: `UPDATE public.userplantransaction SET "Searches" = $1 WHERE "UserId"= $2`,

    get_Searches_By_UserId: `SELECT "Downloads","Searches" FROM public.userplantransaction WHERE "UserId"=$1`,

    get_sidefilter_Access: `SELECT * FROM public."SideFilterAccess" where "Country"=$1 AND "Direction"=$2`,

    get_importer_list: `SELECT DISTINCT "Imp_Name", "Exp_Name" FROM public.import_$1 limit 1000`,
    get_exporter_list: `SELECT DISTINCT "Imp_Name", "Exp_Name" FROM public.export_$1 limit 1000`,

    insert_sidefilter_Access: `INSERT INTO public."SideFilterAccess"(
        "HsCode", "ProductDesc", "Exp_Name", "Imp_Name", "CountryofDestination", "CountryofOrigin", 
                "PortofOrigin", "Mode", "uqc", "Quantity", "Month", "Year", "Country","Direction", "PortofDestination", "LoadingPort", "Currency", 
                "NotifyPartyName")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18);`,
    update_sidefilter_Access: `UPDATE public."SideFilterAccess"
	SET  "HsCode"=$2, "ProductDesc"=$3, "Exp_Name"=$4, "Imp_Name"=$5, "CountryofDestination"=$6, "CountryofOrigin"=$7, "PortofOrigin"=$8, "Mode"=$9, "uqc"=$10, "Quantity"=$11, "Month"=$12, "Year"=$13, "PortofDestination"=$14, "LoadingPort"=$15, "Currency"=$16, "NotifyPartyName"=$17
	WHERE "Country"=$1 AND "Direction"=$18`,
    get_workspace: `SELECT * FROM public.workspace WHERE "UserId"=$1`,

    add_workspace: `INSERT INTO public.workspace(
        "UserId", "Searchbar", "Sidefilter")
        VALUES ($1, $2, $3);`,

    get_download_cost: `SELECT * FROM public."Dowload_cost" WHERE "CountryCode"=$1`,

    check_download_workspancename: `SELECT * FROM public.userdownloadtransaction  where "workspacename"=$1`,

    add_download_workspace: `INSERT INTO public.userdownloadtransaction(
        "countrycode", "userId", direction, "recordIds", workspacename,datetime)
        VALUES ($1, $2, $3, $4, $5, $6);`,

    get_download_Workspace: `SELECT "Id", countrycode as CountryName, "userId", direction,cardinality("recordIds") as totalrecords
    ,"recordIds", workspacename, datetime
        FROM public.userdownloadtransaction WHERE "userId"=$1`,

    update_download_count: `UPDATE public.userplantransaction SET "Downloads" = $1 WHERE "UserId"= $2`,

    get_all_roles: `SELECT * FROM public."Role"`,

    getRoleswithAccess: `SELECT * FROM "Role" inner join "RoleAccess" on "Role"."RoleId" = "RoleAccess"."RoleId" WHERE "Role"."RoleId" =$1`,

    get_userlist:`SELECT * FROM public."Cypher" 
    inner join "Role" on "Cypher"."RoleId" = "Role"."RoleId"
    inner join public.userplantransaction on "Cypher"."UserId" = "userplantransaction"."UserId"
    inner join public.plan  on "plan"."PlanId" = "userplantransaction"."PlanId"
    ORDER BY "Cypher"."UserId" DESC`
};
