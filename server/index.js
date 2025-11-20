const express = require('express');
const path = require('path');
const db = require('./db');
const initialData = require('./initialData');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

async function setupDatabase() {
  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    // Step 1: Create tables with the final, correct schema.
    await client.query(`
      CREATE TABLE IF NOT EXISTS settings ( key TEXT PRIMARY KEY, value JSONB );
      CREATE TABLE IF NOT EXISTS branches ( id TEXT PRIMARY KEY, name TEXT NOT NULL, address TEXT, phone TEXT, is_active BOOLEAN DEFAULT true );
      CREATE TABLE IF NOT EXISTS categories ( id TEXT PRIMARY KEY, name TEXT NOT NULL, sort_order INTEGER );
      CREATE TABLE IF NOT EXISTS menu_items (
        id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT, image_url TEXT,
        category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
        is_active BOOLEAN DEFAULT true, sort_order INTEGER, variants JSONB
      );
      CREATE TABLE IF NOT EXISTS menu_item_branches (
        item_id TEXT REFERENCES menu_items(id) ON DELETE CASCADE,
        branch_id TEXT REFERENCES branches(id) ON DELETE CASCADE,
        PRIMARY KEY (item_id, branch_id)
      );
    `);

    // Step 2: Robust migration logic. Only runs if the old 'price' column exists.
    const priceColumnCheck = await client.query(`SELECT 1 FROM information_schema.columns WHERE table_name='menu_items' AND column_name='price'`);
    if (priceColumnCheck.rows.length > 0) {
      console.log("Old 'price' column found. Starting robust data migration...");
      await client.query(`ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS variants JSONB`);
      const itemsToMigrate = await client.query(`SELECT id, price FROM menu_items WHERE price IS NOT NULL AND (variants IS NULL OR variants::text = 'null')`);
      for (const item of itemsToMigrate.rows) {
        const standardVariant = [{ name: 'Standard', price: parseFloat(item.price) }];
        await client.query(`UPDATE menu_items SET variants = $1 WHERE id = $2`, [JSON.stringify(standardVariant), item.id]);
      }
      await client.query(`ALTER TABLE menu_items DROP COLUMN price`);
      console.log("Data migration completed successfully. 'price' column dropped.");
    }

    // Step 3: Populate with initial data only if the database is completely empty.
    const settingsResult = await client.query('SELECT 1 FROM settings');
    if (settingsResult.rows.length === 0) {
      console.log('Database is empty. Populating with initial data...');
      await client.query('INSERT INTO settings (key, value) VALUES ($1, $2)', ['app_settings', JSON.stringify(initialData.settings)]);
      for (const branch of initialData.branches) {
        await client.query('INSERT INTO branches (id, name, address, phone, is_active) VALUES ($1, $2, $3, $4, $5)', [branch.id, branch.name, branch.address, branch.phone, branch.isActive]);
      }
      for (const category of initialData.categories) {
        await client.query('INSERT INTO categories (id, name, sort_order) VALUES ($1, $2, $3)', [category.id, category.name, category.sortOrder]);
      }
      for (const item of initialData.items) {
        await client.query('INSERT INTO menu_items (id, name, description, image_url, category_id, is_active, sort_order, variants) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [item.id, item.name, item.description, item.imageUrl, item.categoryId, item.isActive, item.sortOrder, JSON.stringify(item.variants)]);
        for (const branchId of item.branchIds) {
          await client.query('INSERT INTO menu_item_branches (item_id, branch_id) VALUES ($1, $2)', [item.id, branchId]);
        }
      }
      console.log('✅ Database muvaffaqiyatli to\'ldirildi.');
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('CRITICAL ERROR during database setup:', err);
    process.exit(1);
  } finally {
    client.release();
  }
}

// API to get all data with guaranteed data shape
app.get('/api/all-data', async (req, res) => {
  try {
    const settingsRes = await db.query('SELECT value FROM settings WHERE key = $1', ['app_settings']);
    const branchesRes = await db.query('SELECT * FROM branches ORDER BY name');
    const categoriesRes = await db.query('SELECT * FROM categories ORDER BY sort_order');
    const itemsRes = await db.query('SELECT * FROM menu_items ORDER BY sort_order');
    const itemBranchesRes = await db.query('SELECT * FROM menu_item_branches');

    const itemsWithBranches = itemsRes.rows.map(item => {
      let cleanVariants = [];
      if (Array.isArray(item.variants)) {
        cleanVariants = item.variants.map(v => ({
          name: (v && v.name) ? String(v.name) : 'Nomsiz',
          price: (v && typeof v.price === 'number') ? v.price : 0,
        })).filter(Boolean);
      }

      return {
        id: item.id, name: item.name, description: item.description,
        variants: cleanVariants, imageUrl: item.image_url, categoryId: item.category_id,
        sortOrder: item.sort_order, isActive: item.is_active,
        branchIds: itemBranchesRes.rows.filter(ib => ib.item_id === item.id).map(ib => ib.branch_id),
      };
    });

    res.json({
      settings: settingsRes.rows[0] ? settingsRes.rows[0].value : {},
      branches: branchesRes.rows.map(b => ({ id: b.id, name: b.name, address: b.address, phone: b.phone, isActive: b.is_active })),
      categories: categoriesRes.rows.map(c => ({ id: c.id, name: c.name, sortOrder: c.sort_order })),
      items: itemsWithBranches,
    });
  } catch (err) {
    console.error('Error fetching all data:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// All other API endpoints (PUT, POST, DELETE) remain the same...
// ... (omitted for brevity)
app.put('/api/settings', async (req, res) => {
    const newSettings = req.body;
    try {
        await db.query('UPDATE settings SET value = $1 WHERE key = $2', [JSON.stringify(newSettings), 'app_settings']);
        res.status(200).json({ message: 'Settings updated successfully' });
    } catch (err) { res.status(500).json({ error: 'Failed to update settings' }); }
});
app.post('/api/categories', async (req, res) => {
    const { id, name, sortOrder } = req.body;
    try {
        await db.query('INSERT INTO categories (id, name, sort_order) VALUES ($1, $2, $3)', [id, name, sortOrder]);
        res.status(201).json({ id, name, sortOrder });
    } catch (err) { res.status(500).json({ error: 'Failed to create category' }); }
});
app.put('/api/categories/:id', async (req, res) => {
    const { id } = req.params; const { name } = req.body;
    try {
        await db.query('UPDATE categories SET name = $1 WHERE id = $2', [name, id]);
        res.status(200).json({ message: 'Category updated' });
    } catch (err) { res.status(500).json({ error: 'Failed to update category' }); }
});
app.delete('/api/categories/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM categories WHERE id = $1', [id]);
        res.status(200).json({ message: 'Category deleted' });
    } catch (err) { res.status(500).json({ error: 'Failed to delete category' }); }
});
app.post('/api/branches', async (req, res) => {
    const { id, name, address, phone } = req.body;
    try {
        await db.query('INSERT INTO branches (id, name, address, phone, is_active) VALUES ($1, $2, $3, $4, $5)', [id, name, address, phone, true]);
        res.status(201).json({ id, name, address, phone });
    } catch (err) { res.status(500).json({ error: 'Failed to create branch' }); }
});
app.put('/api/branches/:id', async (req, res) => {
    const { id } = req.params; const { name, address, phone } = req.body;
    try {
        await db.query('UPDATE branches SET name = $1, address = $2, phone = $3 WHERE id = $4', [name, address, phone, id]);
        res.status(200).json({ message: 'Branch updated' });
    } catch (err) { res.status(500).json({ error: 'Failed to update branch' }); }
});
app.delete('/api/branches/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM branches WHERE id = $1', [id]);
        res.status(200).json({ message: 'Branch deleted' });
    } catch (err) { res.status(500).json({ error: 'Failed to delete branch' }); }
});
app.post('/api/menu-items', async (req, res) => {
    const { id, name, description, imageUrl, categoryId, branchIds, sortOrder, variants } = req.body;
    const client = await db.getClient();
    try {
        await client.query('BEGIN');
        await client.query('INSERT INTO menu_items (id, name, description, image_url, category_id, is_active, sort_order, variants) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [id, name, description, imageUrl, categoryId, true, sortOrder, JSON.stringify(variants)]);
        for (const branchId of branchIds) {
            await client.query('INSERT INTO menu_item_branches (item_id, branch_id) VALUES ($1, $2)', [id, branchId]);
        }
        await client.query('COMMIT');
        res.status(201).json({ message: 'Menu item created' });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: 'Failed to create menu item' });
    } finally {
        client.release();
    }
});
app.put('/api/menu-items/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, imageUrl, categoryId, branchIds, variants } = req.body;
    const client = await db.getClient();
    try {
        await client.query('BEGIN');
        await client.query('UPDATE menu_items SET name = $1, description = $2, image_url = $3, category_id = $4, variants = $5 WHERE id = $6', [name, description, imageUrl, categoryId, JSON.stringify(variants), id]);
        await client.query('DELETE FROM menu_item_branches WHERE item_id = $1', [id]);
        for (const branchId of branchIds) {
            await client.query('INSERT INTO menu_item_branches (item_id, branch_id) VALUES ($1, $2)', [id, branchId]);
        }
        await client.query('COMMIT');
        res.status(200).json({ message: 'Menu item updated' });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: 'Failed to update menu item' });
    } finally {
        client.release();
    }
});
app.put('/api/menu-items/:id/status', async (req, res) => {
    const { id } = req.params; const { isActive } = req.body;
    try {
        await db.query('UPDATE menu_items SET is_active = $1 WHERE id = $2', [isActive, id]);
        res.status(200).json({ message: 'Menu item status updated' });
    } catch (err) { res.status(500).json({ error: 'Failed to update status' }); }
});
app.delete('/api/menu-items/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM menu_items WHERE id = $1', [id]);
        res.status(200).json({ message: 'Menu item deleted' });
    } catch (err) { res.status(500).json({ error: 'Failed to delete menu item' }); }
});

// --- Static Files & Catch-all ---
const buildPath = path.resolve(__dirname, '..', 'dist');
app.use(express.static(buildPath));
app.get('*', (req, res) => { res.sendFile(path.join(buildPath, 'index.html')); });

// --- Start Server ---
const server = app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
  console.log(`📍 http://localhost:${port}`);
  setupDatabase();
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${port} allaqachon band. Boshqa portni tanlang yoki portni bo'shating.`);
    process.exit(1);
  } else {
    console.error('❌ Server xatosi:', err);
    process.exit(1);
  }
});

