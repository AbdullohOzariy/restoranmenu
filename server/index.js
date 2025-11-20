const express = require('express');
const path = require('path');
const db = require('./db');
const initialData = require('./initialData');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// --- Database Initialization ---
async function setupDatabase() {
  try {
    // Create tables if they don't exist
    await db.query(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value JSONB
      );
      CREATE TABLE IF NOT EXISTS branches (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        address TEXT,
        phone TEXT,
        is_active BOOLEAN DEFAULT true
      );
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        sort_order INTEGER
      );
      CREATE TABLE IF NOT EXISTS menu_items (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price NUMERIC(10, 2),
        image_url TEXT,
        category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
        is_active BOOLEAN DEFAULT true,
        sort_order INTEGER
      );
      CREATE TABLE IF NOT EXISTS menu_item_branches (
        item_id TEXT REFERENCES menu_items(id) ON DELETE CASCADE,
        branch_id TEXT REFERENCES branches(id) ON DELETE CASCADE,
        PRIMARY KEY (item_id, branch_id)
      );
    `);

    // Check if settings exist, if not, populate all tables
    const settingsResult = await db.query('SELECT * FROM settings WHERE key = $1', ['app_settings']);
    if (settingsResult.rows.length === 0) {
      console.log('Database is empty. Populating with initial data...');
      
      // Insert settings
      await db.query('INSERT INTO settings (key, value) VALUES ($1, $2)', ['app_settings', JSON.stringify(initialData.settings)]);
      
      // Insert branches
      for (const branch of initialData.branches) {
        await db.query('INSERT INTO branches (id, name, address, phone, is_active) VALUES ($1, $2, $3, $4, $5)', [branch.id, branch.name, branch.address, branch.phone, branch.isActive]);
      }
      
      // Insert categories
      for (const category of initialData.categories) {
        await db.query('INSERT INTO categories (id, name, sort_order) VALUES ($1, $2, $3)', [category.id, category.name, category.sortOrder]);
      }

      // Insert menu_items and their branch relations
      for (const item of initialData.items) {
        await db.query('INSERT INTO menu_items (id, name, description, price, image_url, category_id, is_active, sort_order) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [item.id, item.name, item.description, item.price, item.imageUrl, item.categoryId, item.isActive, item.sortOrder]);
        for (const branchId of item.branchIds) {
          await db.query('INSERT INTO menu_item_branches (item_id, branch_id) VALUES ($1, $2)', [item.id, branchId]);
        }
      }
      console.log('Database populated successfully.');
    }
  } catch (err) {
    console.error('Error setting up database:', err);
    process.exit(1);
  }
}


// --- API Endpoints ---

// GET all data
app.get('/api/all-data', async (req, res) => {
  try {
    const settingsRes = await db.query('SELECT value FROM settings WHERE key = $1', ['app_settings']);
    const branchesRes = await db.query('SELECT * FROM branches ORDER BY name');
    const categoriesRes = await db.query('SELECT * FROM categories ORDER BY sort_order');
    const itemsRes = await db.query('SELECT * FROM menu_items ORDER BY sort_order');
    const itemBranchesRes = await db.query('SELECT * FROM menu_item_branches');

    const itemsWithBranches = itemsRes.rows.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: parseFloat(item.price),
      imageUrl: item.image_url,
      categoryId: item.category_id,
      sortOrder: item.sort_order,
      isActive: item.is_active,
      branchIds: itemBranchesRes.rows
        .filter(ib => ib.item_id === item.id)
        .map(ib => ib.branch_id),
    }));

    res.json({
      settings: settingsRes.rows[0].value,
      branches: branchesRes.rows.map(b => ({...b, isActive: b.is_active})),
      categories: categoriesRes.rows.map(c => ({...c, sortOrder: c.sort_order, name: c.name})),
      items: itemsWithBranches,
    });
  } catch (err) {
    console.error('Error fetching all data:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// --- Settings ---
app.put('/api/settings', async (req, res) => {
    const newSettings = req.body;
    try {
        await db.query('UPDATE settings SET value = $1 WHERE key = $2', [JSON.stringify(newSettings), 'app_settings']);
        res.status(200).json({ message: 'Settings updated successfully' });
    } catch (err) {
        console.error('Error updating settings:', err);
        res.status(500).json({ error: 'Failed to update settings' });
    }
});

// --- Categories ---
app.post('/api/categories', async (req, res) => {
    const { id, name, sortOrder } = req.body;
    try {
        await db.query('INSERT INTO categories (id, name, sort_order) VALUES ($1, $2, $3)', [id, name, sortOrder]);
        res.status(201).json({ id, name, sortOrder });
    } catch (err) {
        console.error('Error creating category:', err);
        res.status(500).json({ error: 'Failed to create category' });
    }
});
app.put('/api/categories/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        await db.query('UPDATE categories SET name = $1 WHERE id = $2', [name, id]);
        res.status(200).json({ message: 'Category updated successfully' });
    } catch (err) {
        console.error('Error updating category:', err);
        res.status(500).json({ error: 'Failed to update category' });
    }
});
app.delete('/api/categories/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM categories WHERE id = $1', [id]);
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (err) {
        console.error('Error deleting category:', err);
        res.status(500).json({ error: 'Failed to delete category' });
    }
});

// --- Branches ---
app.post('/api/branches', async (req, res) => {
    const { id, name, address, phone } = req.body;
    try {
        await db.query('INSERT INTO branches (id, name, address, phone, is_active) VALUES ($1, $2, $3, $4, $5)', [id, name, address, phone, true]);
        res.status(201).json({ id, name, address, phone });
    } catch (err) {
        console.error('Error creating branch:', err);
        res.status(500).json({ error: 'Failed to create branch' });
    }
});
app.put('/api/branches/:id', async (req, res) => {
    const { id } = req.params;
    const { name, address, phone } = req.body;
    try {
        await db.query('UPDATE branches SET name = $1, address = $2, phone = $3 WHERE id = $4', [name, address, phone, id]);
        res.status(200).json({ message: 'Branch updated successfully' });
    } catch (err) {
        console.error('Error updating branch:', err);
        res.status(500).json({ error: 'Failed to update branch' });
    }
});
app.delete('/api/branches/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM branches WHERE id = $1', [id]);
        res.status(200).json({ message: 'Branch deleted successfully' });
    } catch (err) {
        console.error('Error deleting branch:', err);
        res.status(500).json({ error: 'Failed to delete branch' });
    }
});

// --- Menu Items ---
app.post('/api/menu-items', async (req, res) => {
    const { id, name, description, price, imageUrl, categoryId, branchIds, sortOrder } = req.body;
    const client = await db.getClient();
    try {
        await client.query('BEGIN');
        await client.query('INSERT INTO menu_items (id, name, description, price, image_url, category_id, is_active, sort_order) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [id, name, description, price, imageUrl, categoryId, true, sortOrder]);
        for (const branchId of branchIds) {
            await client.query('INSERT INTO menu_item_branches (item_id, branch_id) VALUES ($1, $2)', [id, branchId]);
        }
        await client.query('COMMIT');
        res.status(201).json({ message: 'Menu item created successfully' });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error creating menu item:', err);
        res.status(500).json({ error: 'Failed to create menu item' });
    } finally {
        client.release();
    }
});

app.put('/api/menu-items/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, price, imageUrl, categoryId, branchIds } = req.body;
    const client = await db.getClient();
    try {
        await client.query('BEGIN');
        await client.query('UPDATE menu_items SET name = $1, description = $2, price = $3, image_url = $4, category_id = $5 WHERE id = $6', [name, description, price, imageUrl, categoryId, id]);
        await client.query('DELETE FROM menu_item_branches WHERE item_id = $1', [id]);
        for (const branchId of branchIds) {
            await client.query('INSERT INTO menu_item_branches (item_id, branch_id) VALUES ($1, $2)', [id, branchId]);
        }
        await client.query('COMMIT');
        res.status(200).json({ message: 'Menu item updated successfully' });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error updating menu item:', err);
        res.status(500).json({ error: 'Failed to update menu item' });
    } finally {
        client.release();
    }
});

app.put('/api/menu-items/:id/status', async (req, res) => {
    const { id } = req.params;
    const { isActive } = req.body;
    try {
        await db.query('UPDATE menu_items SET is_active = $1 WHERE id = $2', [isActive, id]);
        res.status(200).json({ message: 'Menu item status updated' });
    } catch (err) {
        console.error('Error updating menu item status:', err);
        res.status(500).json({ error: 'Failed to update status' });
    }
});

app.delete('/api/menu-items/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM menu_items WHERE id = $1', [id]);
        res.status(200).json({ message: 'Menu item deleted successfully' });
    } catch (err) {
        console.error('Error deleting menu item:', err);
        res.status(500).json({ error: 'Failed to delete menu item' });
    }
});


// --- Static Files & Catch-all ---
const buildPath = path.join(process.cwd(), 'dist');
app.use(express.static(buildPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});


// --- Start Server ---
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  setupDatabase();
});
