function alterExternalData(row) {
    if (!!row.item) {
        row['bricklink-item-url'] = `https://bricklink.com/v2/catalog/catalogitem.page?M=${row.item}`
        row['bricklink-item-image'] = `https://img.bricklink.com/ItemImage/MN/0/${row.item}.png`;
        // row['brickset-minifig'] = `https://brickset.com/minifigs/${row.item}`
    }
    if (!!row.part) {
        row['bricklink-part-url'] = `https://www.bricklink.com/v2/catalog/catalogitem.page?P=${row.part}`
        row['bricklink-part-image'] = `https://img.bricklink.com/PL/${row.part}.jpg`;
        // https://img.bricklink.com/ItemImage/PN/3/3003pb118.png
        // https://img.bricklink.com/ItemImage/PL/3003pb118.png

        // https://img.bricklink.com/ItemImage/PN/5/66855pb01.png
        // https://img.bricklink.com/ItemImage/PL/66855pb01.png
    }
    if (!!row.set) {
        row['bricklink-set-url'] = `https://bricklink.com/v2/catalog/catalogitem.page?S=${row.set}`
        // minifig['bricklink-set-image'] = `https://img.bricklink.com/S/${minifig.set}-1.jpg` // sometimes you need the "-1"

        row['brickset-set-url'] = `https://brickset.com/sets/${row.set}`
    }
    if (!!row.gear) {
        row['bricklink-gear-url'] = `https://bricklink.com/v2/catalog/catalogitem.page?G=${row.gear}`
        row['bricklink-gear-image'] = `https://img.bricklink.com/ItemImage/GN/0/${row.gear}.png`
        // "img.bricklink.com/ItemImage/GN/0/magbat010.png"
    }

    row['table-image'] = fallback(row, ['image', 'bricklink-item-image', 'bricklink-part-image', 'bricklink-gear-image']);
    return row;
}
