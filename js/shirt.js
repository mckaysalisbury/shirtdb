function makeLocal(file) {
    return `images/shirts/${file}`;
}

function makeAllImagesLocal(row) {
    for (const [key, value] of Object.entries(row)) {
        if (key.match(`image(?!s)`)) {
            row[key] = makeLocal(row[key]);
        }
    }
    return row;
}

function alterExternalData(row) {
    if (!row.images) {
        console.error('missing images', row);
    } else {
        for (const image of row.images) {
            row[`image-${image}`] = `${row['images-name']}-${image}.jpg`
        }
        delete row.images;
        delete row['image-name'];
    }

    makeAllImagesLocal(row);
    row['table-image'] = fallback(row, [ 'image-logo', 'image-front', 'image-back' ]);

    if (row.source) {
        row.source = makeLink(row.source);
    }

    if (!row.text) {
        console.error('missing text', row);
    } else {
        row.text = row.text.map(replaceMandatoryEntities);
        if (!row.text) {
            console.error('Row does not have a `text` property.', row);
        } else {
            row['table-text'] = row.text.filter(line => line.length !== 0).splice(0, 5).join('<br />')
        }
    }

    return row
}
