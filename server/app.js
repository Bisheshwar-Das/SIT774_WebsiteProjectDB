const express = require('express');
const multer = require('multer');
const path = require('path');
const morgan = require('morgan');
const db = require('./scenarioDB');

const app = express();
const port = 3000;

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(morgan('common'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static folders
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// -----------------------------
// Multer configuration
// -----------------------------
const storage = multer.diskStorage({
  destination: path.join(__dirname, 'uploads'),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// ========================
// API Routes
// ========================

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// View all scenarios
app.get('/all-scenarios', (req, res) => {
  const scenarioSql = `
    SELECT id, title, description, author, tags, upvotes, downvotes, imageUrl, status, createdAt
    FROM scenario
    ORDER BY createdAt DESC
  `;
  const tagsSql = 'SELECT name, color FROM tags';

  db.all(scenarioSql, [], (err, rows) => {
    if (err) {
      console.error('Scenario DB error:', err.message);
      return res.status(500).json({ error: 'Error fetching scenarios' });
    }

    db.all(tagsSql, [], (tagErr, tagRows) => {
      if (tagErr) {
        console.error('Tags DB error:', tagErr.message);
        return res.status(500).json({ error: 'Error fetching tag colors' });
      }

      const tagColorMap = {};
      tagRows.forEach(tag => {
        tagColorMap[tag.name] = tag.color;
      });

      const scenarios = rows.map(row => ({
        ...row,
        tags: row.tags ? JSON.parse(row.tags) : [],
        imageUrl: row.imageUrl ? `/uploads/${row.imageUrl}` : null
      }));

      res.status(200).json({ scenarios, tagColorMap });
    });
  });
});

// View a single discussion
app.get('/discussion/:id', (req, res) => {
  const scenarioId = req.params.id;

  db.get('SELECT * FROM scenario WHERE id = ?', [scenarioId], (err, scenario) => {
    if (err) {
      console.error('Error fetching scenario:', err.message);
      return res.status(500).send('Server error');
    }
    if (!scenario) return res.status(404).send('Scenario not found.');

    let tags = [];
    try {
      tags = scenario.tags ? JSON.parse(scenario.tags) : [];
    } catch (parseErr) {
      console.error('Error parsing tags JSON:', parseErr.message);
    }

    db.all('SELECT * FROM comment WHERE scenario_id = ? ORDER BY timestamp DESC', [scenarioId], (commentErr, comments) => {
      if (commentErr) return res.status(500).send('Server error');

      db.all('SELECT name, color FROM tags', (tagErr, tagRows) => {
        if (tagErr) return res.status(500).send('Server error');

        const tagColorMap = {};
        tagRows.forEach(tag => tagColorMap[tag.name] = tag.color);

        scenario.imageUrl = scenario.imageUrl ? `/uploads/${scenario.imageUrl}` : null;
        scenario.tags = tags;
        scenario.comments = comments;

        res.render('discussion', { scenario, tagColorMap });
      });
    });
  });
});

// Form submission
app.post('/submit', upload.single('scenarioImage'), (req, res) => {
  const title = req.body.scenarioTitle;
  const description = req.body.scenarioDescription;
  const tagsArray = req.body['multiple-select-custom-field[]'] || req.body['multiple-select-custom-field'];
  const tags = Array.isArray(tagsArray) ? tagsArray : [tagsArray];
  const image = req.file ? req.file.filename : null;

  const author = 'Anonymous';
  const upvotes = 0;
  const downvotes = 0;
  const status = 'active';
  const createdAt = new Date().toISOString();

  const sql = `
    INSERT INTO scenario (title, description, author, tags, upvotes, downvotes, imageUrl, status, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.run(sql, [title, description, author, JSON.stringify(tags), upvotes, downvotes, image, status, createdAt], function (err) {
    if (err) return res.status(500).send('Database error');

    res.render('submitted', { title, description, tags, imageUrl: image, createdAt });
  });
});

// Contact form
app.post('/contact', (req, res) => {
  const { name, email, phone, message } = req.body;
  const submittedAt = new Date().toISOString();

  const sql = `
    INSERT INTO contact (name, email, phone, message, submittedAt)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.run(sql, [name, email, phone, message, submittedAt], function (err) {
    if (err) return res.status(500).send('Database error saving contact form');
    res.render('contact', { name, email, phone, message, submittedAt });
  });
});

// Post comment
app.post('/discussion/:id/comment', (req, res) => {
  const { comment } = req.body;
  const scenarioId = req.params.id;
  const author = 'Anonymous';

  db.run(`
    INSERT INTO comment (scenario_id, author, comment, timestamp)
    VALUES (?, ?, ?, datetime('now'))
  `, [scenarioId, author, comment], (err) => {
    if (err) return res.status(500).send('Database error saving comment');
    res.redirect(`/discussion/${scenarioId}`);
  });
});

// -----------------------------
// Fallback route for frontend SPA
// -----------------------------
app.get('*', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// ========================
// Start server
// ========================
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Web server running at: http://localhost:${port}`);
  });
}

module.exports = app;
