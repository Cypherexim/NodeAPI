queryCondition = (params) => {
    var conditions = [];
    var values = [0];

    params.forEach((item, index) => {
        switch (item.eq) {
            case '=': {
                conditions.push('"' + item.name + '"' + " = $" + (index + 1));
                values.insert(item.value);
                break;
            }
            case '!=': {
                conditions.push('"' + item.name + '"' + " != $" + (index + 1));
                values.push(item.value);
                break;
            }
            case '>=': {
                conditions.push('"' + item.name + '"' + " >= $" + (index + 1));
                values.push(item.value);
                break;
            }
            case '<=': {
                conditions.push('"' + item.name + '"' + " <= $" + (index + 1));
                values.push(item.value);
                break;
            }
            case '%_%': {
                conditions.push('"' + item.name + '"' + " ILIKE $" + (index + 1));
                values.push("%" + item.value + "%");
                break;
            }
            case 'IN': {
                conditions.push('"' + item.name + '"' + " IN ($" + (index + 1) + ")");
                values.push(item.value);
                break;
            }
            case 'ANY': {
                conditions.push('"' + item.name + '"' + " = ANY ($" + (index + 1) + ")");
                values.push(item.value);
                break;
            }
            case 'SIMILAR TO': {
                conditions.push('"' + item.name + '"' + " SIMILAR TO ($" + (index + 1) + ")");
                values.push(item.value);
                break;
            }
        }
    });

    return [conditions, values]
}

exports.generateFilterQuery = (params, selectQuery, tablename) => {
    let conditions, values = []
    let conditionsStr;

    if (params.length == 0) {
        return false
    }

    [conditions, values] = queryCondition(params)
    // let withdesc = conditions.filter(x => x.includes('ProductDesc'));
    // let withoutdesc = conditions.filter(x => !x.includes('ProductDesc'));
    let build = {
        where: conditions.length ?
            conditions.join(' AND ') : '1',
        values: values
    };
    // let build = {
    //     where: conditions.length ?
    //         withoutdesc.join(' AND ') + (withdesc.length > 0 ? ' AND (' + withdesc.join(' OR ') + ')' : '') : '1',
    //     values: values
    // };

    let query = 'SELECT ' + selectQuery + ' ' + tablename + ' WHERE ' + build.where;
    return [query, build.values]
}

exports.generateParams = (name, eq, value) => {
    return {
        name: name,
        eq: eq, // %_%, %_, _%, =, >, <, !=,
        value: value
    }
}
exports.formatDate = (date) => {
    return [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
    ].join('-');
}
function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}