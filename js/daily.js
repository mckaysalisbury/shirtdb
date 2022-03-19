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

    const keyword = new URLSearchParams(document.location.search).get("keyword");

    function hasKeyword(row) {
        if (!row.keywords) {
            console.error("Row doesn't have 'keywords'.", row);
            return false;
        }
        return !keyword || row.keywords.includes(keyword);
    }

    // https://www.datatables.net/examples/ajax/objects.html
    const dataTable = table.DataTable({
        ajax: {
            url: dataUrl,
            dataSrc: (response) => (data = response.data).filter(hasKeyword).map(addRecentDate).map(alterData).map(listPrimaryImage),
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
        } else if (key.match(`image(?!s)`) ) {
            row[key] = makeLink(value, makeImage(value));
        }
    }
    return row;
}

function keywordsToLinks(row) {
    row.keywords = row.keywords.map(keyword => `<a href="${itemsPage()}?keyword=${keyword}">${keyword}</a>`);
    return row;
}

function itemsPage() {
    return document.location.pathname.replace(/\.html/, "s.html");
}

function setupItem(url, preprocess) {
    const id = new URLSearchParams(document.location.search).get("id");
    if (id === null) {
        alert("ID Not specified. Redirecting to list of all items");
        document.location = itemsPage();
    } else {
        const div = $('<div id="mainDiv">');
        $(document.body).append(div)

        $.ajax({url, success: function(result) {
            const matches = result.data.filter(minifig => minifig.id === id);
            if (matches.length === 0) {
                alert("ID specified not found");
            } else if (matches.length > 1) {
                alert("ID specified found twice");
            } else {
                match = keywordsToLinks(htmlify(preprocess(matches[0])));
                for (key in match) {
                    if (key.startsWith(tablePrefix)) {
                        delete match[key]; // duplicate only needed for tables
                    }
                }
                ListBoy.RenderTo(match, "mainDiv");
            }
        }});
    }
}

function findDuplicates() {
    const ids = data.map(i => i.id);
    return ids.filter((item, index) => index !== ids.indexOf(item));
}
