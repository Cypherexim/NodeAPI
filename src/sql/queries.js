'use strict';

module.exports = {
    get_import:'SELECT * FROM public.import_data ORDER BY "RecordID" ASC LIMIT 10000',
    get_import_by_recordId:`SELECT * FROM public.import_data where "RecordID"=$1`,
    get_import_search:`select * from import_data WHERE "Date" BETWEEN $1 AND $2 
    AND ("HSCODE"::text ILIKE $3) AND ("HSCodeDesc" ILIKE $4) 
    AND ("Importer_Name" ILIKE $5) AND ("EXPORTER_NAME" ILIKE $6) 
    order by "RecordID" limit 1000000`
};
