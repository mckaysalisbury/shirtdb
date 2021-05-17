function clean(row) {
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
