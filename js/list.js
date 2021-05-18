function addRecentDate(row) {
    row.dates.sort()
    row.recentDate = row.dates[row.dates.length - 1] || null
    return row;
}

function listPrimaryImage(row) {
    if (!!row.image) {
        row.image = `<img src="${row.image}" alt='item image'/>`;
    }
    return row;
}

function fallback(row, columns) {
    for (const column of columns) {
        if (!!row[column]) {
            return row[column];
        }
    }
    return null;
}

function setupList(dataUrl, addColumns, displayColumns, itemPage) {
    const table = $("<table>");
    displayColumns = [].concat(displayColumns, ['recentDate']);
    table.html(`<thead>${
        ''.concat(displayColumns.map((name) => `<th>${name}</th>`))
    }</thead>`);

    // https://www.datatables.net/examples/ajax/objects.html
    table.DataTable({
        ajax: {
            url: dataUrl,
            dataSrc: (response) => response.data.map(addRecentDate).map(addColumns).map(listPrimaryImage),
        },
        rowId: 'id',
        columns: displayColumns.map((name) => { return {'data': name}}),
        createdRow: function(row) {
            $(row).click(() => document.location = `${itemPage}?id=${row.id}`);
        },
        order: [[displayColumns.indexOf('recentDate'), 'desc']]
    });
    $(document.body).append(table);
}
