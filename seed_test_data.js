const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');

const username = 'admin';

db.serialize(() => {
    // Delete existing food items and history for the 'admin' user
    db.run("DELETE FROM food_items WHERE username = ?", [username]);
    db.run("DELETE FROM history_log WHERE username = ?", [username]);

    console.log('Cleared existing data for:', username);

    // Insert food items
    const foodItems = [
        {
            id: 'item_1_milk',
            username: username,
            name: 'Organic Whole Milk',
            category: 'dairy',
            storage: 'Fridge',
            qty: 1.0,
            unit: 'pcs',
            dateAdded: '2026-07-20',
            dateExpiry: '2026-07-24', // Expires in 24 hours (relative to 2026-07-23)
            imageData: null
        },
        {
            id: 'item_2_salmon',
            username: username,
            name: 'Fresh Salmon Filet',
            category: 'meat',
            storage: 'Freezer',
            qty: 2.0,
            unit: 'pcs',
            dateAdded: '2026-07-22',
            dateExpiry: '2026-07-29', // Expires in 6 days
            imageData: null
        },
        {
            id: 'item_3_yogurt',
            username: username,
            name: 'Greek Yogurt',
            category: 'dairy',
            storage: 'Fridge',
            qty: 1.0,
            unit: 'pcs',
            dateAdded: '2026-07-15',
            dateExpiry: '2026-07-23', // Expires today
            imageData: null
        },
        {
            id: 'item_4_bananas',
            username: username,
            name: 'Organic Bananas',
            category: 'fruit',
            storage: 'Pantry',
            qty: 5.0,
            unit: 'pcs',
            dateAdded: '2026-07-18',
            dateExpiry: '2026-07-28', // Expires in 5 days
            imageData: null
        },
        {
            id: 'item_5_spinach',
            username: username,
            name: 'Fresh Spinach Bag',
            category: 'produce',
            storage: 'Fridge',
            qty: 1.0,
            unit: 'bag',
            dateAdded: '2026-07-19',
            dateExpiry: '2026-07-27', // Expires in 4 days
            imageData: null
        },
        {
            id: 'item_6_sourdough',
            username: username,
            name: 'Sourdough Bread',
            category: 'bakery',
            storage: 'Pantry',
            qty: 1.0,
            unit: 'loaf',
            dateAdded: '2026-07-20',
            dateExpiry: '2026-07-25', // Expires in 2 days
            imageData: null
        }
    ];

    const stmtFood = db.prepare(`INSERT INTO food_items (id, username, name, category, storage, qty, unit, dateAdded, dateExpiry, imageData) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    foodItems.forEach(item => {
        stmtFood.run([item.id, item.username, item.name, item.category, item.storage, item.qty, item.unit, item.dateAdded, item.dateExpiry, item.imageData]);
    });
    stmtFood.finalize();
    console.log('Seeded food_items:', foodItems.length);

    // Insert history log items
    const historyLogs = [
        {
            id: 'hist_1',
            username: username,
            name: 'Farm Fresh Eggs',
            category: 'dairy',
            storage: 'Fridge',
            qty: 12.0,
            unit: 'pcs',
            resolution: 'consumed',
            dateHandled: '2026-07-22'
        },
        {
            id: 'hist_2',
            username: username,
            name: 'Avocados',
            category: 'produce',
            storage: 'Pantry',
            qty: 2.0,
            unit: 'pcs',
            resolution: 'wasted',
            dateHandled: '2026-07-21'
        },
        {
            id: 'hist_3',
            username: username,
            name: 'Cheddar Cheese Block',
            category: 'dairy',
            storage: 'Fridge',
            qty: 1.0,
            unit: 'pcs',
            resolution: 'consumed',
            dateHandled: '2026-07-20'
        },
        {
            id: 'hist_4',
            username: username,
            name: 'Organic Strawberries',
            category: 'fruit',
            storage: 'Fridge',
            qty: 1.0,
            unit: 'box',
            resolution: 'consumed',
            dateHandled: '2026-07-19'
        },
        {
            id: 'hist_5',
            username: username,
            name: 'Chicken Breasts',
            category: 'meat',
            storage: 'Fridge',
            qty: 4.0,
            unit: 'pcs',
            resolution: 'consumed',
            dateHandled: '2026-07-18'
        },
        {
            id: 'hist_6',
            username: username,
            name: 'Spinach Salad',
            category: 'produce',
            storage: 'Fridge',
            qty: 1.0,
            unit: 'bag',
            resolution: 'wasted',
            dateHandled: '2026-07-17'
        },
        {
            id: 'hist_7',
            username: username,
            name: 'Bacon Pack',
            category: 'meat',
            storage: 'Fridge',
            qty: 1.0,
            unit: 'pcs',
            resolution: 'consumed',
            dateHandled: '2026-07-16'
        },
        {
            id: 'hist_8',
            username: username,
            name: 'White Bread Loaf',
            category: 'bakery',
            storage: 'Pantry',
            qty: 1.0,
            unit: 'loaf',
            resolution: 'consumed',
            dateHandled: '2026-07-15'
        }
    ];

    const stmtHist = db.prepare(`INSERT INTO history_log (id, username, name, category, storage, qty, unit, resolution, dateHandled) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    historyLogs.forEach(item => {
        stmtHist.run([item.id, item.username, item.name, item.category, item.storage, item.qty, item.unit, item.resolution, item.dateHandled]);
    });
    stmtHist.finalize();
    console.log('Seeded history_log:', historyLogs.length);

    db.close();
});
