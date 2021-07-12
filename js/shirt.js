function makeLocal(file) {
    return `images/shirts/${file}`;
}

function makeAllImagesLocal(row) {
    for (const [key, value] of Object.entries(row)) {
        if (key.includes('image')) {
            row[key] = makeLocal(row[key]);
        }
    }
    return row;
}

function addExternalData(row) {
    makeAllImagesLocal(row);
    row['table-image'] = fallback(row, [ 'image-logo', 'image-front', 'image-back' ]);
    if (!row.text) {
        console.error('Row does not have a `text` property.', row);
    } else {
        row['table-text'] = row.text.filter(line => line.length !== 0).splice(0, 5).join('<br />')
    }
    return row
}
