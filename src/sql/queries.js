'use strict';

module.exports = {
    get_import: 'SELECT * FROM public.import_india ORDER BY "RecordID" ASC LIMIT 10000',
    get_import_by_recordId: `SELECT * FROM public.import_india where "RecordID"=$1`,
    get_import_search: `select * from import_india WHERE "Date" BETWEEN $1 AND $2 
    AND ("HSCODE"::text ILIKE $3) OR ("HSCodeDesc" ILIKE $4) 
    OR ("Importer_Name" ILIKE $5) OR ("EXPORTER_NAME" ILIKE $6) 
    order by "RecordID" limit 1000000`,
    update_country: `UPDATE public."Country" SET  "Import"=$1, "Export"=$2 WHERE "Countrycode"=$3;`,
    add_user_by_admin: `INSERT INTO public."Cypher"(
        "FullName", "CompanyName", "MobileNumber", "Email", "Password","CountryCode","ParentUserId")
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING public."Cypher"."UserId";`,
    add_user: `INSERT INTO public."Cypher"(
        "FullName", "CompanyName", "MobileNumber", "Email", "Password", "CountryCode", "ParentUserId", "Designation", "Location", "GST", "IEC","RoleId")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING public."Cypher"."UserId";;`,
    update_user: `UPDATE public."Cypher"
	SET "FullName"=$1, "CompanyName"=$2, "MobileNumber"=$3, "Email"=$4, "CountryCode"=$5,
    "Designation"=$6, "Location"=$7, "GST"=$8, "IEC"=$9, "RoleId"=$10 WHERE "UserId"=$11`,
    enable_disable_user: `UPDATE public."Cypher" SET "Enable"=$1 WHERE "UserId"= $2;`,
    get_user_by_email: `SELECT "FullName", "CompanyName", "MobileNumber", "Email", "Password","RoleName", "Cypher"."UserId", "CountryCode", "ParentUserId", "Designation", "Location", "GST", "IEC", "Cypher"."RoleId", "Enable","userPreference", public.userplantransaction."PlanId", public.userplantransaction."Downloads", public.userplantransaction."Searches", 
    public.userplantransaction."StartDate", public.userplantransaction."EndDate", public.userplantransaction."Validity",
    public.userplantransaction."DataAccess", public.userplantransaction."CountryAccess", 
    public.userplantransaction."CommodityAccess", public.userplantransaction."TarrifCodeAccess", 
    public.userplantransaction."Workspace", public.userplantransaction."WSSLimit", public.userplantransaction."Downloadfacility",
    public.userplantransaction."Favoriteshipment", public.userplantransaction."Whatstrending", public.userplantransaction."Companyprofile", 
    public.userplantransaction."Addonfacility", public.userplantransaction."Analysis", public.userplantransaction."User",("EndDate"- now()::date) AS Remainingdays FROM public."Cypher" 
    inner join public.userplantransaction on "Cypher"."UserId" = "userplantransaction"."UserId" 
    inner join public.plan on "userplantransaction"."PlanId" = "plan"."PlanId" 
    inner join "Role" on "Cypher"."RoleId" = "Role"."RoleId"
    where "Email"=$1`,
    get_user_by_parentuser: `SELECT "FullName", "CompanyName", "MobileNumber", "Email", "Password","RoleName", "Cypher"."UserId", "CountryCode", "ParentUserId", "Designation", "Location", "GST", "IEC", "Cypher"."RoleId", "Enable","userPreference", public.userplantransaction."PlanId", public.userplantransaction."Downloads", public.userplantransaction."Searches", 
    public.userplantransaction."StartDate", public.userplantransaction."EndDate", public.userplantransaction."Validity",
    public.userplantransaction."DataAccess", public.userplantransaction."CountryAccess", 
    public.userplantransaction."CommodityAccess", public.userplantransaction."TarrifCodeAccess", 
    public.userplantransaction."Workspace", public.userplantransaction."WSSLimit", public.userplantransaction."Downloadfacility",
    public.userplantransaction."Favoriteshipment", public.userplantransaction."Whatstrending", public.userplantransaction."Companyprofile", 
    public.userplantransaction."Addonfacility", public.userplantransaction."Analysis", public.userplantransaction."User",("EndDate"- now()::date) AS Remainingdays FROM public."Cypher" 
    inner join public.userplantransaction on "Cypher"."ParentUserId" = "userplantransaction"."UserId" 
    inner join public.plan on "userplantransaction"."PlanId" = "plan"."PlanId" 
    inner join "Role" on "Cypher"."RoleId" = "Role"."RoleId"
    where "Email"=$1`,
    get_user_email: `SELECT * FROM public."Cypher" where "Email"=$1`,
    get_user_by_email_forchangepassword: `SELECT * FROM public."Cypher" where "Email"=$1`,
    reset_password:`UPDATE public."Cypher" SET "Password"=$1 WHERE "Email"=$2`,
    update_password: `UPDATE public."Cypher" SET "Password"=$1 WHERE "UserId"=$2`,
    get_user_email: `SELECT * FROM public."Cypher" WHERE "Email"=$1`,
    get_hscode_import: 'SELECT * FROM public.HSCodes',
    get_hscode_export: 'SELECT "Hscode","HscodeDesc" FROM public."HSCodes"',
    get_hscode_export_digit: 'SELECT "Hscode" ,"HscodeDesc" FROM public."HSCodes" where length("Hscode") =$1',
    getCountry: `SELECT "Countrycode", "CountryName", "Import", "Export","LatestDate", "StartDate","Direction"  FROM public."Country" inner join public.datauploadhistorybydate on
    public.datauploadhistorybydate."CountryCode" = public."Country"."Countrycode"
    ORDER BY "CountryName"`,
    getCountryWithoutDate:`SELECT "Countrycode", "CountryName" FROM public."Country" ORDER BY "CountryName";`,
    getCountryByCountrycode:`SELECT * FROM public."Country" where "Countrycode"=$1`,
    getLatestDate: `SELECT "LatestDate" FROM public.datauploadhistorybydate where "CountryCode"=$1 AND "Direction"=$2;`,
    addCountry: 'INSERT INTO public."Country"("Countrycode", "CountryName", "Import", "Export") VALUES ($1, $2, $3, $4)',
    addDataHistory: `INSERT INTO public.datauploadhistorybydate(
        "CountryCode", "Direction", "LatestDate")
        VALUES ($1, $2, $3);`,
    updateDataHistory: `UPDATE public.datauploadhistorybydate SET "LatestDate"=$1 WHERE "CountryCode"=$2 AND "Direction"=$3;`,
    addDownloadCost: 'INSERT INTO public."Dowload_cost" ("CountryCode", "CostPerRecord") VALUES ($1, $2);',
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
    update_Plan_Trasaction_by_admin: `UPDATE public.userplantransaction
	SET "PlanId"=$1, "Downloads"=$2, "Searches"=$3, "StartDate"=$4, "EndDate"=$5, "Validity"=$6, "DataAccess"=$7, "CountryAccess"=$8, "CommodityAccess"=$9, "TarrifCodeAccess"=$10, "Workspace"=$11, "WSSLimit"=$12, "Downloadfacility"=$13, "Favoriteshipment"=$14, "Whatstrending"=$15, "Companyprofile"=$16, "Addonfacility"=$17, "Analysis"=$18, "User"=$19
	WHERE "UserId"=$20`,
    update_user_Access: `UPDATE public."UserAccess"
	SET "AddUser"=$2, "EditUser"=$3, "DeleteUser"=$4, "AddPlan"=$5, 
	"EditPlan"=$6, "DeletePlan"=$7, "Downloads"=$8, "Search"=$9, "EnableId"=$10, "DisableId"=$11, 
	"BlockUser"=$12, "UnblockUser"=$13, "ClientList"=$14, "PlanList"=$15, "Share"=$16
	WHERE "UserId"=$1;`,
    add_user_Access: `INSERT INTO public."UserAccess"(
        "AddUser", "EditUser", "DeleteUser", "AddPlan", "EditPlan", "DeletePlan", "Downloads", "Search", "EnableId", "DisableId", "BlockUser", "UnblockUser", "ClientList", "PlanList", "UserId","Share")
        VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16);`,
    get_Plan_By_UserId: `SELECT * FROM public.userplantransaction WHERE "UserId"=$1`,
    share_download_files: `INSERT INTO public.userdownloadtransaction(countrycode, "userId", direction, workspacename, datetime, "recordIds", "filePath", status, errorlog, expirydate)
    select "countrycode", $1,direction, workspacename, $3, "recordIds", "filePath", status, errorlog, expirydate
    from public.userdownloadtransaction where "Id"=$2`,
    insert_share_history: `INSERT INTO public."ShareHistory"(shareby, shareto, date, "workspaceId") VALUES ($1, $2, $3, $4);`,
    update_Plan_transaction: `UPDATE public.userplantransaction SET "Searches" = $1 WHERE "UserId"= $2`,
    get_cypher_userby_id: `SELECT * FROM public."Cypher" where "UserId"=$1`,
    get_Searches_By_UserId: `SELECT "userplantransaction"."UserId", "userplantransaction"."PlanId", "userplantransaction"."Downloads", 
    "userplantransaction"."Searches", "userplantransaction"."StartDate", "userplantransaction"."EndDate", 
    "userplantransaction"."Validity", "userplantransaction"."DataAccess", 
    "userplantransaction"."CountryAccess", "userplantransaction"."CommodityAccess", "userplantransaction"."TarrifCodeAccess", "userplantransaction"."Workspace", 
    "userplantransaction"."WSSLimit", "userplantransaction"."Downloadfacility", "userplantransaction"."Favoriteshipment", "userplantransaction"."Whatstrending", "userplantransaction"."Companyprofile", 
    "userplantransaction"."Addonfacility", "userplantransaction"."Analysis", "userplantransaction"."User","userplantransaction"."Downloads","plan"."PlanName","userplantransaction"."Searches",("EndDate"- now()::date) AS Remainingdays,
	"AddUser", "EditUser", "DeleteUser", "AddPlan", "EditPlan", "DeletePlan", "UserAccess"."Downloads" as Dwnlds, "Search", "EnableId", "DisableId", "BlockUser", "UnblockUser", "ClientList", "PlanList", "Share"
    FROM public.userplantransaction 
	inner join "plan" on "plan"."PlanId" = "userplantransaction"."PlanId" 
	inner join "UserAccess" on "UserAccess"."UserId" = "userplantransaction"."UserId"
	WHERE "userplantransaction"."UserId"=$1`,
    get_user_by_ParentId: `SELECT * FROM public."Cypher" where "ParentUserId"=$1`,
    get_sidefilter_Access: `SELECT * FROM public."SideFilterAccess" where "Country"=$1 AND "Direction"=$2`,
    get_first_sidefilter_Access: `SELECT "HsCode" FROM public."SideFilterAccess" where "Country"=$1 AND "Direction"=$2`,
    get_Import_sidefilter_Access: `SELECT "Imp_Name" FROM public."SideFilterAccess" where "Country"=$1 AND "Direction"=$2`,
    get_Export_sidefilter_Access: `SELECT "Exp_Name" FROM public."SideFilterAccess" where "Country"=$1 AND "Direction"=$2`,
    get_second_sidefilter_Access: `SELECT "CountryofDestination", "CountryofOrigin" FROM public."SideFilterAccess" where "Country"=$1 AND "Direction"=$2`,
    get_third_sidefilter_Access: `SELECT uqc, "Quantity", "Month", "Year" FROM public."SideFilterAccess" where "Country"=$1 AND "Direction"=$2`,
    get_fourth_sidefilter_Access: `SELECT  "PortofDestination", "LoadingPort", "Currency", "NotifyPartyName" FROM public."SideFilterAccess" where "Country"=$1 AND "Direction"=$2`,
    get_fifth_sidefilter_Access: `SELECT "PortofOrigin", "Mode" FROM public."SideFilterAccess" where "Country"=$1 AND "Direction"=$2`,
    get_all_sidefilter_Access: `SELECT * FROM public."SideFilterAccess"`,
    getimporter_export_india: `SELECT * FROM public.importer_export_india ORDER BY "Imp_Name" limit 500`,
    getimporter_import_india: `SELECT * FROM public.importer_import_india ORDER BY "Imp_Name" limit 500`,
    getexporter_export_india: `SELECT * FROM public.exporter_export_india ORDER BY "Exp_Name" limit 500`,
    getexporter_import_india: `SELECT * FROM public.exporter_import_india ORDER BY "Exp_Name" limit 500`,

    getimporter_export_india_search: `SELECT * FROM public.importer_export_india WHERE "Imp_Name" like $1 ORDER BY "Imp_Name" limit 500`,
    getimporter_import_india_search: `SELECT * FROM public.importer_import_india WHERE "Imp_Name" like $1 ORDER BY "Imp_Name" limit 500`,
    getexporter_export_india_search: `SELECT * FROM public.exporter_export_india WHERE "Exp_Name" like $1 ORDER BY "Exp_Name" limit 500`,
    getexporter_import_india_search: `SELECT * FROM public.exporter_import_india WHERE "Exp_Name" like $1 ORDER BY "Exp_Name" limit 500`,

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
    get_workspace: `SELECT * FROM public.workspace WHERE "UserId"=$1 or
    "UserId" IN(SELECT "UserId" from public."Cypher" where "ParentUserId"=$1) AND visible = true`,

    add_workspace: `INSERT INTO public.workspace(
        "UserId", "Searchbar", "Sidefilter","foldername")
        VALUES ($1, $2, $3,$4);`,

    delete_Workspace: `UPDATE public.workspace SET visible=$1 WHERE "Id"=$2;`,

    get_download_cost: `SELECT * FROM public."Dowload_cost" WHERE "CountryCode"=$1`,

    check_download_workspancename: `SELECT * FROM public.userdownloadtransaction  where "workspacename"=$1`,

    add_download_workspace: `INSERT INTO public.userdownloadtransaction(
        "countrycode", "userId", direction, "recordIds", workspacename,datetime,"filePath","status","errorlog","expirydate")
        VALUES ($1, $2, $3, $4, $5, $6,$7,$8,$9,$10) RETURNING public."userdownloadtransaction"."Id";`,
    update_download_workspace: `UPDATE public.userdownloadtransaction SET "recordIds"= $1, "filePath"= $2, "status"= $3, "errorlog"= $4, "expirydate" = $5 WHERE "Id"= $6;`,

    get_download_Workspace: `SELECT "Id", countrycode as CountryName, "userId", direction,cardinality("recordIds") as totalrecords
    , workspacename, datetime,"filePath","status","errorlog","expirydate"
        FROM public.userdownloadtransaction WHERE "userId"=$1 or
        "userId" IN(SELECT "UserId" from public."Cypher" where "ParentUserId"=$1)`,

    update_download_count: `UPDATE public.userplantransaction SET "Downloads" = $1 WHERE "UserId"= $2`,

    get_all_roles: `SELECT * FROM public."Role"`,

    getRoleswithAccess: `SELECT * FROM "Role" inner join "RoleAccess" on "Role"."RoleId" = "RoleAccess"."RoleId" WHERE "Role"."RoleId" =$1`,

    get_userlist: `SELECT "FullName", "CompanyName", "MobileNumber", "Email", "Cypher"."UserId", "CountryCode", "ParentUserId", "Designation",
    "Location", "GST", "IEC", "Cypher"."RoleId","Cypher"."Enable","userplantransaction"."Downloads", "userplantransaction"."Searches", 
    "userplantransaction"."StartDate", "userplantransaction"."EndDate", "userplantransaction"."Validity", 
    "userplantransaction"."DataAccess", "userplantransaction"."CountryAccess", "userplantransaction"."CommodityAccess", 
    "userplantransaction"."TarrifCodeAccess", "userplantransaction"."Workspace", "userplantransaction"."WSSLimit", 
    "userplantransaction"."Downloadfacility", "userplantransaction"."Favoriteshipment", "userplantransaction"."Whatstrending", 
    "userplantransaction"."Companyprofile", "userplantransaction"."Addonfacility", "userplantransaction"."Analysis", 
    "userplantransaction"."User"
    ,"plan"."PlanId", "plan"."PlanName",
	"AddUser", "EditUser", "DeleteUser", "AddPlan", "EditPlan", "DeletePlan", "UserAccess"."Downloads" as Dwnlds, "Search", "EnableId", "DisableId", "BlockUser", "UnblockUser", "ClientList", "PlanList", "Share"
    FROM public."Cypher" 
        inner join "Role" on "Cypher"."RoleId" = "Role"."RoleId"
        inner join public.userplantransaction on "Cypher"."UserId" = "userplantransaction"."UserId" OR "Cypher"."ParentUserId" = "userplantransaction"."UserId"
        inner join public."UserAccess" on "Cypher"."UserId" = "UserAccess"."UserId" OR "Cypher"."ParentUserId" = "UserAccess"."UserId"
        inner join public.plan  on "plan"."PlanId" = "userplantransaction"."PlanId"
    ORDER BY "Cypher"."UserId" DESC`,
    get_user_By_Userid: `SELECT * FROM public."Cypher" 
    inner join "Role" on "Cypher"."RoleId" = "Role"."RoleId"
    inner join public.userplantransaction on "Cypher"."UserId" = "userplantransaction"."UserId"
    inner join public.plan  on "plan"."PlanId" = "userplantransaction"."PlanId"
    WHERE "UserId"=$1
    ORDER BY "Cypher"."UserId" DESC`,
    get_alert_message:`SELECT * FROM public.alert_msg where "id"=$1 AND "status"= true`,
    add_notification:`INSERT INTO public.push_notifications(message, created_date) VALUES ($1, $2);`,
    get_notification:`SELECT * FROM public.push_notifications where "Id"=$1`,
    get_notification_all:`SELECT * FROM public.push_notifications`,
    update_userPreferences:`UPDATE public."Cypher" SET "userPreference"=$2 WHERE "Email"=$1`,
    update_alert_message:`UPDATE public.alert_msg SET txt_msg=$1 WHERE id=$2`,
    get_all_countries:`SELECT * FROM public.all_countries Order by country`,
    insert_userlog:`INSERT INTO public."Userlog"("UserId", "IP", "Location", "Searchcount", "Searchhistory", "Datetime")
	VALUES ($1, $2, $3, $4, $5, $6);`,
    get_userlog:`SELECT * FROM "Userlog" where "UserId"=$1 AND "Datetime"=$2`,
    get_all_userlog:`SELECT "Id", "Userlog"."UserId", "IP", "Userlog"."Location", "Searchcount", "Searchhistory", "Datetime", "Email" FROM public."Userlog" inner join "Cypher" on "Userlog"."UserId" = "Cypher"."UserId" ORDER BY "Datetime" DESC`,
    update_userlog:`update "Userlog" set "Searchcount" = "Searchcount" + $1 where "UserId"=$2 AND "Datetime"=$3`,
    add_user_action_log:`INSERT INTO public."UserActionLog"("UserId", "LogType", "Log", "CreatedDate") VALUES ($1, $2, $3, $4);`,
    get_user_action_log:`SELECT * FROM public."UserActionLog" where "LogType" ILIKE $1 ORDER BY "CreatedDate" DESC`,
    get_Name_by_userid:`SELECT "FullName", "Email" FROM public."Cypher" where "UserId"=$1`,
    add_user_Activity_log:`INSERT INTO public."UserActivityLog"("UserId", "Lastlogin", "IP","Email") VALUES ( $1, $2, $3, $4);`,
    get_user_Activitylist:`SELECT * FROM "UserActivityLog" Where "UserId"=$1 ORDER BY "Lastlogin" DESC`,
    get_user_ActivityAlllist:`SELECT * FROM "UserActivityLog" ORDER BY "Lastlogin" DESC`,
    getWhatstrandingTotalVal: `select total_import, total_export, total_value from whatstranding_totalvalues where year=$1 and active=true`,
};
