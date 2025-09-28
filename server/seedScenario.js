const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, './database/scenarioDB.db');
const db = new sqlite3.Database(dbPath);

//transfering scenarios.json to db
const scenarios = [
  {    'title': 'What if humanity lived on Mars?',
    'description': 'How would our society adapt to life on Mars? Explore the possibilities.',
    'author': 'John Doe',
    'tags': ['SciFi', 'Space'],
    'upvotes': 102,
    'downvotes': 8,
    'imageUrl': '../Resources/mars.jpg',
    'status': 'active',
    'createdAt': '2025-03-06T09:00:00Z',
    'comments': [
      {
        'author': 'Jane Smith',
        'comment': 'I think Mars is the next step for humanity!',
        'timestamp': '2025-03-15T10:00:00Z'
      },
      {
        'author': 'Mark Lee',
        'comment': 'The idea of a Martian society is fascinating!',
        'timestamp': '2025-03-18T08:45:00Z'
      },
      {
        'author': 'Alice Cooper',
        'comment': 'The challenges of living on Mars are so interesting to think about!',
        'timestamp': '2025-03-22T14:30:00Z'
      }
    ]
  },
  {    'title': 'What if dinosaurs never went extinct?',
    'description': 'Imagine a world where dinosaurs still roam the Earth alongside humans.',
    'author': 'Jane Doe',
    'tags': ['Historical', 'Dinosaurs'],
    'upvotes': 123,
    'downvotes': 11,
    'imageUrl': '../Resources/dinosaur.jpg',
    'status': 'active',
    'createdAt': '2025-03-07T14:00:00Z',
    'comments': [
      {
        'author': 'Tom Brown',
        'comment': 'Humans and dinosaurs coexisting would be crazy!',
        'timestamp': '2025-03-13T11:30:00Z'
      },
      {
        'author': 'Sara White',
        'comment': 'What would happen to modern wildlife?',
        'timestamp': '2025-03-20T12:45:00Z'
      },
      {
        'author': 'Brian King',
        'comment': 'Would dinosaurs be domesticated, or would we be in danger?',
        'timestamp': '2025-03-21T10:00:00Z'
      }
    ]
  },
  {    'title': 'What if time travel was possible?',
    'description': 'What impact would time travel have on the present and future?',
    'author': 'John Smith',
    'tags': ['Philosophical', 'TimeTravel'],
    'upvotes': 56,
    'downvotes': 4,
    'imageUrl': '../Resources/time-travel.jpg',
    'status': 'active',
    'createdAt': '2025-03-09T13:15:00Z',
    'comments': [
      {
        'author': 'Alice Cooper',
        'comment': 'Imagine the paradoxes we\'d have to deal with!',
        'timestamp': '2025-03-10T16:00:00Z'
      },
      {
        'author': 'Michael Green',
        'comment': 'Time travel could change everything!',
        'timestamp': '2025-03-18T09:30:00Z'
      }
    ]
  },
  {    'title': 'What if humans could communicate with animals?',
    'description': 'Imagine a world where humans could understand and communicate with animals. How would this change our relationship with wildlife?',
    'author': 'Samantha Taylor',
    'tags': ['Philosophical', 'Animals'],
    'upvotes': 89,
    'downvotes': 3,
    'imageUrl': '../Resources/animaltalk.jpg',
    'status': 'active',
    'createdAt': '2025-03-10T08:00:00Z',
    'comments': [
      {
        'author': 'Brian King',
        'comment': 'This would change the way we view animal rights.',
        'timestamp': '2025-03-14T17:00:00Z'
      },
      {
        'author': 'Ella Smith',
        'comment': 'I wonder what animals would say if they could talk!',
        'timestamp': '2025-03-19T15:30:00Z'
      },
      {
        'author': 'Sarah Webb',
        'comment': 'Can you imagine having a conversation with a whale?',
        'timestamp': '2025-03-20T13:00:00Z'
      }
    ]
  },
  {    'title': 'What if the internet ceased to exist?',
    'description': 'How would society adapt if the internet suddenly disappeared? Would we return to old ways of communication?',
    'author': 'Daniel Lee',
    'tags': ['Deep', 'Society'],
    'upvotes': 60,
    'downvotes': 12,
    'imageUrl': '../Resources/nointernet.jpg',
    'status': 'active',
    'createdAt': '2025-03-12T11:00:00Z',
    'comments': [
      {
        'author': 'Sophia Green',
        'comment': 'We\'d probably be lost without the internet!',
        'timestamp': '2025-03-17T13:30:00Z'
      },
      {
        'author': 'David White',
        'comment': 'What would life be like without social media?',
        'timestamp': '2025-03-21T14:00:00Z'
      }
    ]
  },
  {    'title': 'What if we could upload our consciousness into a computer?',
    'description': 'The possibility of transferring human consciousness into a digital form. Would this be the key to immortality, or create new ethical dilemmas?',
    'author': 'Rachel Adams',
    'tags': ['SciFi', 'Ethical'],
    'upvotes': 134,
    'downvotes': 6,
    'imageUrl': '../Resources/computermind.jpg',
    'status': 'active',
    'createdAt': '2025-03-14T14:45:00Z',
    'comments': [
      {
        'author': 'Nina Morris',
        'comment': 'The ethics around this would be insane!',
        'timestamp': '2025-03-15T09:15:00Z'
      },
      {
        'author': 'George Hall',
        'comment': 'Can you really call it immortality if you\'re a computer?',
        'timestamp': '2025-03-19T11:45:00Z'
      },
      {
        'author': 'Kyle Spencer',
        'comment': 'It could change what it means to be human.',
        'timestamp': '2025-03-20T10:20:00Z'
      }
    ]
  },
  {    'title': 'What if humans could teleport?',
    'description': 'Imagine a world where teleportation is possible. How would transportation, travel, and society change?',
    'author': 'Emma Stone',
    'tags': ['SciFi', 'Technology'],
    'upvotes': 145,
    'downvotes': 10,
    'imageUrl': '../Resources/teleportation.jpg',
    'status': 'active',
    'createdAt': '2025-04-10T10:00:00Z',
    'comments': [
      {
        'author': 'Chris Evans',
        'comment': 'Teleportation could revolutionize global travel!',
        'timestamp': '2025-04-12T14:00:00Z'
      },
      {
        'author': 'Olivia Watson',
        'comment': 'Security concerns would be huge if teleportation were to become mainstream.',
        'timestamp': '2025-04-15T11:45:00Z'
      }
    ]
  },
  {    'title': 'What if humanity could live underwater?',
    'description': 'What would it be like if humans adapted to life underwater? Would we build cities in the deep ocean or create floating colonies?',
    'author': 'Sophia Harris',
    'tags': ['SciFi', 'Environment'],
    'upvotes': 108,
    'downvotes': 7,
    'imageUrl': '../Resources/underwater.jpg',
    'status': 'active',
    'createdAt': '2025-04-11T12:30:00Z',
    'comments': [
      {
        'author': 'John Walker',
        'comment': 'I could see humanity exploring the ocean depths in the same way we\'ve explored space.',
        'timestamp': '2025-04-13T10:45:00Z'
      },
      {
        'author': 'Emma White',
        'comment': 'The challenges of living underwater would be immense, but the possibilities are endless!',
        'timestamp': '2025-04-14T16:30:00Z'
      }
    ]
  },
  {    'title': 'What if artificial intelligence ruled the world?',
    'description': 'What would society look like if AI gained enough intelligence to govern humanity? Would we live in harmony or chaos?',
    'author': 'James King',
    'tags': ['SciFi', 'Technology'],
    'upvotes': 137,
    'downvotes': 15,
    'imageUrl': '../Resources/ai-world.jpg',
    'status': 'active',
    'createdAt': '2025-04-12T14:15:00Z',
    'comments': [
      {
        'author': 'David Clark',
        'comment': 'AI could bring a lot of efficiency, but it might also take away human agency.',
        'timestamp': '2025-04-14T09:30:00Z'
      },
      {
        'author': 'Amy Wilson',
        'comment': 'Could AI develop emotions and form its own views of what is best for humanity?',
        'timestamp': '2025-04-16T08:00:00Z'
      }
    ]
  },
  {
    'title': 'What if humans could never age?',
    'description': 'What if humans were biologically immortal? How would societies, economies, and personal lives change in a world where aging no longer occurs?',
    'author': 'Lucas Grey',
    'tags': ['Philosophical', 'HumanCondition'],
    'upvotes': 92,
    'downvotes': 20,
    'imageUrl': '../Resources/immortality.jpg',
    'status': 'active',
    'createdAt': '2025-04-13T15:00:00Z',
    'comments': [
      {
        'author': 'Samantha Green',
        'comment': 'Imagine the implications for overpopulation and resource distribution!',
        'timestamp': '2025-04-14T16:30:00Z'
      },
      {
        'author': 'David Brown',
        'comment': 'Would immortality make life more meaningful or more monotonous?',
        'timestamp': '2025-04-15T13:00:00Z'
      }
    ]
  },
  {
    'title': 'What if the Earth stopped rotating?',
    'description': 'What would happen if the Earth suddenly stopped rotating? How would gravity, weather, and the planet itself be affected?',
    'author': 'Lucas Hamilton',
    'tags': ['Science', 'Earth'],
    'upvotes': 115,
    'downvotes': 5,
    'imageUrl': '../Resources/earth-stop.jpg',
    'status': 'active',
    'createdAt': '2025-04-14T17:00:00Z',
    'comments': [
      {
        'author': 'Mia Adams',
        'comment': 'The effects on the planet would be catastrophic! The oceans alone would be a disaster.',
        'timestamp': '2025-04-15T10:30:00Z'
      },
      {
        'author': 'Daniel Harris',
        'comment': 'We\'d probably experience massive changes in climate patterns, too.',
        'timestamp': '2025-04-16T14:00:00Z'
      }
    ]
  },
  {
    'title': 'What if humans could manipulate time?',
    'description': 'What if humans could control the flow of time? How would we use this power, and what consequences might follow?',
    'author': 'Emily Cooper',
    'tags': ['SciFi', 'Philosophical'],
    'upvotes': 125,
    'downvotes': 12,
    'imageUrl': '../Resources/time-manipulation.jpg',
    'status': 'active',
    'createdAt': '2025-04-15T11:15:00Z',
    'comments': [
      {
        'author': 'Lucas Brown',
        'comment': 'Time manipulation would be both a blessing and a curse. The possibilities are mind-blowing!',
        'timestamp': '2025-04-16T09:00:00Z'
      },
      {
        'author': 'Olivia Moore',
        'comment': 'Could time manipulation lead to unintended consequences, like paradoxes or disasters?',
        'timestamp': '2025-04-18T12:45:00Z'
      }
    ]
  }
];

db.serialize(() => {
  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS scenario (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      author TEXT,
      tags TEXT,
      upvotes INTEGER,
      downvotes INTEGER,
      imageUrl TEXT,
      status TEXT,
      createdAt TEXT
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS comment (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      scenario_id INTEGER,
      author TEXT,
      comment TEXT,
      timestamp TEXT,
      FOREIGN KEY(scenario_id) REFERENCES scenario(id)
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE,
      color TEXT
    );
  `);

  const insertScenario = db.prepare(`
    INSERT INTO scenario (title, description, author, tags, upvotes, downvotes, imageUrl, status, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertComment = db.prepare(`
    INSERT INTO comment (scenario_id, author, comment, timestamp)
    VALUES (?, ?, ?, ?)
  `);

  function getRandomColor() {
    return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
  }

  function insertTagsFromScenario(tagsArray) {
    tagsArray.forEach(tag => {
      const color = getRandomColor();
      db.run(`
        INSERT OR IGNORE INTO tags (name, color) VALUES (?, ?)
      `, [tag, color]);
    });
  }

  const scenarioCount = scenarios.length;
  let completed = 0;

  scenarios.forEach((scenario) => {
    insertScenario.run(
      scenario.title,
      scenario.description,
      scenario.author || 'Anonymous',
      JSON.stringify(scenario.tags),
      scenario.upvotes,
      scenario.downvotes,
      scenario.imageUrl,
      scenario.status,
      scenario.createdAt,
      function () {
        const scenarioId = this.lastID;
        const comments = scenario.comments || [];

        // Pass tags array (not string)
        insertTagsFromScenario(scenario.tags);

        comments.forEach((comment) => {
          insertComment.run(
            scenarioId,
            comment.author,
            comment.comment,
            comment.timestamp
          );
        });

        completed++;
        if (completed === scenarioCount) {
          insertScenario.finalize();
          insertComment.finalize();
          db.close();
          console.log('✅ Seeding completed!');
        }
      }
    );
  });
});
