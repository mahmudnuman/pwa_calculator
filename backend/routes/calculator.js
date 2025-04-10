const express = require('express');
const router = express.Router();
const db = require('../models/db');
const verifyToken = require('../middleware/auth');

// 📥 POST /api/calc — Save calculation
router.post('/', verifyToken, (req, res) => {
  const { expression, result } = req.body;
  const userId = req.userId;

  if (!expression || result === undefined) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  db.query(
    'INSERT INTO history (user_id, expression, result) VALUES (?, ?, ?)',
    [userId, expression, result],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Failed to save calculation' });
      res.status(201).json({ message: 'Calculation saved' });
    }
  );
});

// 📤 GET /api/calc/history — Get user's history
router.get('/history', verifyToken, (req, res) => {
  const userId = req.userId;

  db.query(
    'SELECT id, expression, result, created_at FROM history WHERE user_id = ? ORDER BY created_at DESC LIMIT 10',
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Failed to fetch history' });
      res.json(results);
    }
  );
});

router.post('/delete', verifyToken, (req, res) => {
  const historyId = req.body.historyId;
  const userId = req.userId;

  if (!historyId) {
    return res.status(400).json({ message: 'History ID is required' });
  }

  const sql = 'DELETE FROM history WHERE id = ? AND user_id = ?';
  db.query(sql, [historyId, userId], (err, result) => {
    if (err) {
      console.error('Error in deleting history entry:', err);
      return res.status(500).json({ message: 'Failed to delete history entry' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'History entry not found' });
    }

    res.status(204).send(); // No content, deletion successful
  });
});


  

module.exports = router;
