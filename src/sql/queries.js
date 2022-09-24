'use strict';

module.exports = {
    get_import:'SELECT * FROM public.import_data ORDER BY "RecordID" ASC LIMIT 10000',
    get_import_by_recordId:`SELECT * FROM public.import_data where "RecordID"=$1`
};
