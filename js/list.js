function cleanShirts(row) {
    row.dates.sort()
    row.recentDate = row.dates[row.dates.length - 1] || null
    row.image = row['image-logo'] || row['image-front'] || row['image-back'] || null; // null because datatable needs something
    if (!!row.image) {
        row.image = `<img src="images/shirts/${row.image}" alt='shirt image'/>`;
    }
    return row
}

function cleanMinifigs(row) {
    row.dates.sort()
    row.recentDate = row.dates[row.dates.length - 1] || null
    row.image = row['image'] || null; // null because datatable needs something
    if (!!row.image) {
        row.image = `<img src="images/minifigs/${row.image}" alt='minifig image'/>`;
    } else if (!!row.item) {
        row.image = `<img src="https://img.bricklink.com/ItemImage/MN/0/${row.item}.png" alt='minifig image'/>`;
    } else {
        row.image = `<img src="https://img.bricklink.com/PL/${row.part}.jpg" alt='minifig image'/>`;
    }
    return row
}

function setupList(dataUrl, columns, clean, itemPage) {
    const table = $("<table>");
    table.html(`<thead>${
        ''.concat(columns.map((name) => `<th>${name}</th>`))
    }</thead>`);

    // https://www.datatables.net/examples/ajax/objects.html
    table.DataTable({
        ajax: {
            url: dataUrl,
            dataSrc: (response) => response.data.map(clean),
        },
        rowId: 'id',
        columns: columns.map((name) => { return {'data': name}}),
        createdRow: function(row) {
            $(row).click(() => document.location = `${itemPage}?id=${row.id}`);
        },
        order: [[columns.indexOf('recentDate'), 'desc']]
    });
    $(document.body).append(table);
}
