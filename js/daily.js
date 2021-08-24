const tablePrefix = 'table-'
let data = [];

function addRecentDate(row) {
    if (!row.dates) {
        console.error("Row doesn't have 'dates'.", row);
    } else {
        row.dates.sort()
        row.recentDate = row.dates[row.dates.length - 1] || null
    }
    return row;
}

function listPrimaryImage(row) {
    if (!!row['table-image']) {
        row['table-image'] = makeImage(row['table-image']);
    }
    return row;
}

function fallback(row, columns) {
    for (const column of columns) {
        if (!!row[column]) {
            return row[column];
        }
    }
    return null; // null because datatable needs something
}

function setupList(dataUrl, alterData, displayColumns, itemPage) {
    const table = $("<table>");
    displayColumns = [].concat(displayColumns, ['table-image', 'recentDate']);
    table.html(`<thead>${
        ''.concat(displayColumns.map((name) => `<th>${name.replace(tablePrefix, '')}</th>`))
    }</thead>`);
    $(document.body).append(table);

    // https://www.datatables.net/examples/ajax/objects.html
    table.DataTable({
        ajax: {
            url: dataUrl,
            dataSrc: (response) => (data = response.data).map(addRecentDate).map(alterData).map(listPrimaryImage),
        },
        rowId: 'id',
        columns: displayColumns.map((name) => { return {'data': name}}),
        createdRow: function(row) {
            $(row).click(() => document.location = `${itemPage}?id=${row.id}`);
        },
        order: [[displayColumns.indexOf('recentDate'), 'desc']]
    });
}

function makeLink(uri, content = uri) {
    return `<a href="${uri}">${content}</a>`;
}
function makeImage(uri, alt = 'item image') {
    return `<img src="${uri}" alt="${alt}"/>`;
}

const entityMap = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
};

function replaceMandatoryEntities(value) {
    return value.replace(/[<&>]/g, (c) => entityMap[c] );
}

function htmlify(row) {
    for (const [key, value] of Object.entries(row)) {
        if (key.includes('url')) {
            row[key] = makeLink(value);
        } else if (key.includes('image-')) {
            row[key] = makeLink(value, makeImage(value));
        }
    }
    return row;
}

function setupItem(url, preprocess) {
    const id = new URLSearchParams(document.location.search).get("id");
    if (id === null) {
        alert("ID Not specified");
    } else {
        const div = $('<div id="mainDiv">')
        $(document.body).append(div)

        $.ajax({url, success: function(result) {
            const matches = result.data.filter(minifig => minifig.id === id);
            if (matches.length === 0) {
                alert("ID specified not found")
            } else {
                match = htmlify(preprocess(matches[0]));
                for (key in match) {
                    if (key.startsWith(tablePrefix)) {
                        delete match[key]; // duplicate only needed for tables
                    }
                }
                ListBoy.RenderTo(match, "mainDiv")
            }
        }});
    }
}
