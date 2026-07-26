const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');
db.all("SELECT username, name, category, storage, qty, unit, dateAdded, dateExpiry FROM food_items", [], (err, rows) => {
    console.log('Count:', rows.length);
    rows.forEach(r => console.log(`${r.username} - ${r.name} (${r.category}, ${r.storage}) - ${r.qty} ${r.unit} - Expires: ${r.dateExpiry}`));
    db.close();
});
