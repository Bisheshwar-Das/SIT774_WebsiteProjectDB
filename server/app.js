// The package for the web server
const express = require('express');
const multer = require('multer');
const path = require('path');
const morgan = require('morgan');
const db = require('./scenarioDB');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Define where and how to save images
const storage = multer.diskStorage({
  destination: path.join(__dirname, 'uploads'),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, './uploads/')));


// Serve index.html directly 
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


// Form submission route
app.post('/submit', upload.single('scenarioImage'), (req, res) => {
  const title = req.body.scenarioTitle;
  const description = req.body.scenarioDescription;
  const tagsArray = req.body['multiple-select-custom-field[]'] || req.body['multiple-select-custom-field'];
  const tags = Array.isArray(tagsArray) ? tagsArray : [tagsArray];
  const image = req.file ? req.file.filename : null;

  const author = "Anonymous";
  const upvotes = 0;
  const downvotes = 0;
  const status = "active";
  const createdAt = new Date().toISOString();

  const sql = `
    INSERT INTO scenario (title, description, author, tags, upvotes, downvotes, imageUrl, status, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [title, description, author, JSON.stringify(tags), upvotes, downvotes, image, status, createdAt], function (err) {
    if (err) {
      console.error(' DB insert error:', err.message);
      return res.status(500).send('Database error');
    }

    // Success response
    res.render('submitted', {
      title,
      description,
      tags,
      imageUrl: image,
      createdAt
    });

  });
});

// Route to view all submitted scenarios
app.get('/all-scenarios', (req, res) => {
  const scenarioSql = `
    SELECT id, title, description, author, tags, upvotes, downvotes, imageUrl, status, createdAt
    FROM scenario
    ORDER BY createdAt DESC
  `;

  const tagsSql = `SELECT name, color FROM tags`;

  db.all(scenarioSql, [], (err, rows) => {
    if (err) {
      console.error('Scenario DB error:', err.message);
      return res.status(500).send('Error fetching scenarios');
    }

    db.all(tagsSql, [], (tagErr, tagRows) => {
      if (tagErr) {
        console.error('Tags DB error:', tagErr.message);
        return res.status(500).send('Error fetching tag colors');
      }

      const tagColorMap = {};
      tagRows.forEach(tag => {
        tagColorMap[tag.name] = tag.color;
      });

      const scenarios = rows.map(row => ({
        ...row,
        tags: JSON.parse(row.tags),
        imageUrl: row.imageUrl ? `/uploads/${row.imageUrl}` : null
      }));

      res.render('allScenarios', { scenarios, tagColorMap });
    });
  });
});




//contact related route
app.post('/contact', (req, res) => {
  const { name, email, phone, message } = req.body;
  const submittedAt = new Date().toISOString();

  const sql = `
    INSERT INTO contact (name, email, phone, message, submittedAt)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(sql, [name, email, phone, message, submittedAt], function (err) {
    if (err) {
      console.error('DB insert error:', err.message);
      return res.status(500).send('Database error saving contact form');
    }

    // Show a confirmation page with the submitted data
    res.render('contact', { name, email, phone, message, submittedAt })
  });
});


// Route to serve a single discussion page by ID
app.get('/discussion/:id', (req, res) => {
  const scenarioId = req.params.id;

  db.get(`SELECT * FROM scenario WHERE id = ?`, [scenarioId], (err, scenario) => {
    if (err) {
      console.error('Error fetching scenario:', err.message);
      return res.status(500).send('Server error');
    }

    if (!scenario) {
      return res.status(404).send('Scenario not found.');
    }

    let tags = [];
    try {
      tags = JSON.parse(scenario.tags);
    } catch (parseErr) {
      console.error('Error parsing tags JSON:', parseErr.message);
    }

    db.all(`SELECT * FROM comment WHERE scenario_id = ? ORDER BY timestamp DESC`, [scenarioId], (commentErr, comments) => {
      if (commentErr) {
        console.error('Error fetching comments:', commentErr.message);
        return res.status(500).send('Server error');
      }

      db.all(`SELECT name, color FROM tags`, (tagErr, tagRows) => {
        if (tagErr) {
          console.error('Error fetching tags:', tagErr.message);
          return res.status(500).send('Server error');
        }

        if (!Array.isArray(tagRows)) {
          console.error('tagRows is not an array:', tagRows);
          return res.status(500).send('Server error');
        }

        const tagColorMap = {};
        tagRows.forEach(tag => {
          tagColorMap[tag.name] = tag.color;
        });

        scenario.imageUrl = scenario.imageUrl ? `/uploads/${scenario.imageUrl}` : null;
        scenario.tags = tags;
        scenario.comments = comments;

        res.render('discussion', { scenario, tagColorMap });
      });
    });
  });
});


//commments
app.post('/discussion/:id/comment', async (req, res) => {
  const { comment } = req.body;
  const scenarioId = req.params.id;

  // For now, hardcoded author
  const author = "Anonymous";

  await db.run(`
    INSERT INTO comment (scenario_id, author, comment, timestamp)
    VALUES (?, ?, ?, datetime('now'))
  `, [scenarioId, author, comment]);

  res.redirect(`/discussion/${scenarioId}`);
});




app.use(morgan('common'));
app.use(express.static('public'));
app.listen(port, () => {
  console.log(`Web server running at: http://localhost:${port}`);
  console.log(`Type Ctrl+C to shut down the web server`);
});