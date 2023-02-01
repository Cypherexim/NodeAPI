module.exports = {
    DefaultPlan: 'Start-Up', // Default plan name
    DefaultRole: 1,
    /* Table names */
    Plan: "plan",
    Cypher: "Cypher",
    HsCode: "HSCodes",
    HsCode: "Test",
    HsCode: "Country",
    export_srilanka: "export_srilanka",
    import_bangladesh: "import_bangladesh",
    export_bangladesh: "export_bangladesh",
    userplantransaction: "userplantransaction",
    export_philip: "export_philip",
    import_srilanka: "import_srilanka",
    import_chile: "import_chile",
    export_ethiopia: "export_ethiopia",
    import_ethiopia: "import_ethiopia",
    export_chile: "export_chile",
    workspace: "workspace",
    import_india: "import_india",
    export_india: "export_india",
    Dowload_cost: "Dowload_cost",
    SideFilterAccess: "SideFilterAccess",
    userdownloadtransaction: "userdownloadtransaction",
    import_philip: "import_philip",

    /* Select Queries */
    select_Query_for_totalrecords:'*, count(*) OVER() AS total_records FROM',
    select_Query_for_totalCounts:'COUNT(distinct  "Exp_Name") as TotalExpName, COUNT(distinct  "Imp_Name") as TotalImpName, COUNT(distinct  "HsCode") as TotalHsCode FROM'
}
