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
    import_india: "import_data",
    export_india: "export_data",
    export_turkey:"export_turkey",
    import_turkey:"import_turkey",
    export_russia:"export_russia",
    import_russia:"import_russia",
    Dowload_cost: "Dowload_cost",
    SideFilterAccess: "SideFilterAccess",
    userdownloadtransaction: "userdownloadtransaction",
    import_philip: "import_philip",
    import_usa:"import_usa",
    import_vietnam:"import_vietnam",
    import_kenya:"import_kenya",
    import_lesotho:"import_lesotho",
    import_mexico:"import_mexico",
    import_nigeria:"import_nigeria",
    export_kenya:"export_kenya",
    export_lesotho:"export_lesotho",
    export_mexico:"export_mexico",
    export_nigeria:"export_nigeria",
    /* Select Queries */
    select_Query_for_totalrecords:'*, count(*) OVER() AS total_records FROM',
    select_Query_for_totalCounts:'COUNT(distinct  "Exp_Name") as TotalExpName, COUNT(distinct  "Imp_Name") as TotalImpName, COUNT(distinct  "HsCode") as TotalHsCode FROM',

    /* Mail Configuration */
    fromEmail:'webeximpanel@gmail.com',
    fromPassword:'gayrsqtbgrlvltit',
    userRegisterationmailSubject:'User Registered Successfully !',
    accountcreationmailBody:'Congratulations! Your account has been created successfully.\nYour password is the first five letters of your first name, followed by the last five digits of your contact number.\n\ne.g Jayesh Patel 9890101234 \nso password will be Jayes01234\n\nThank you for showing your trust in our services. Your satisfaction is our priority, and we will continue to strive to provide you with the highest quality products and services. We look forward to continuing to build our relationship and for the opportunities that lie ahead. If you have any questions or concerns, please do nott hesitate to contact us.'
}
