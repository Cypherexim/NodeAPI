queryCondition = (params) => {
    var conditions = [];
    var values = [];

    params.forEach((item, index) => {
        switch (item.eq) {
            case '=': {
                conditions.push('"' + item.name + '"' + " = $" + (index + 1));
                values.push(item.value);
                break;
            }
            case '!=': {
                conditions.push(item.name + " != $" + index);
                values.push(item.value);
                break;
            }
            case '<': {
                conditions.push(item.name + " < $" + index);
                values.push(item.value);
                break;
            }
            case '>': {
                conditions.push(item.name + " > $" + index);
                values.push(item.value);
                break;
            }
            case '%_%': {
                conditions.push(item.name + " LIKE $" + index);
                values.push("%" + item.value + "%");
                break;
            }
            case '%_': {
                conditions.push(item.name + " LIKE $" + index);
                values.push("%" + item.value);
                break;
            }
            case '_%': {
                conditions.push(item.name + " LIKE ?");
                values.push(item.value + "%");
                break;
            }
        }
    });

    return [conditions, values]
}

exports.generateFilterQuery = (params, tablename) => {
    let conditions, values = []
    let conditionsStr;

    if (params.length == 0) {
        return false
    }

    [conditions, values] = queryCondition(params)

    let build = {
        where: conditions.length ?
            conditions.join(' AND ') : '1',
        values: values
    };

    let query = 'SELECT * FROM ' + tablename + ' WHERE ' + build.where;
    return [query, build.values]
}

exports.generateParams = (name, eq, value) => {
    return {
        name: name,
        eq: eq, // %_%, %_, _%, =, >, <, !=,
        value: value
    }
}