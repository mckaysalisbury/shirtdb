function addExternalData(row) {
    row.image = row['image'] || null; // null because datatable needs something
    if (!!row.item) {
        row['bricklink-item-image'] = `https://img.bricklink.com/ItemImage/MN/0/${row.item}.png`;
    }
    if (!!row.part) {
        row['bricklink-part-image'] = `https://img.bricklink.com/PL/${row.part}.jpg`;
    }

    row.image = fallback(row, ['image', 'bricklink-item-image', 'bricklink-part-image']);
    return row;
}
