import { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../utils/auth';

function Calculator() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState([]);

  const handleButtonClick = (value) => {
    setExpression((prevExpression) => prevExpression + value);
  };

  const calculate = () => {
    try {
      const res = eval(expression); // ⚠️ Only for learning, never use eval in production!
      setResult(res);
      saveCalculation(expression, res);
    } catch {
      setResult('Error');
    }
  };

  const saveCalculation = async (expr, res) => {
    try {
      await axios.post('http://localhost:5000/api/calc', {
        expression: expr,
        result: res,
      }, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      fetchHistory();
    } catch (err) {
      console.error('Save failed');
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/calc/history', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setHistory(res.data);
    } catch (err) {
      console.error('Fetch history failed');
    }
  };

  const clear = () => {
    setExpression('');
    setResult('');
  };

  const handleBackspace = () => {
    setExpression((prevExpression) => prevExpression.slice(0, -1));
  };

  const deleteHistoryItem = async (id) => {
    try {
      await axios.post('http://localhost:5000/api/calc/delete', 
        { historyId: id }, 
        {
          headers: { Authorization: `Bearer ${getToken()}` }, // Include the JWT token in the header
        }
      );
      fetchHistory(); // Refresh the history list after deletion
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };
  

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="calculator-container mt-5">
      <h2>Calculator</h2>
      <div className="input-group mb-3">
        <input
          className="form-control text-right"
          placeholder="Enter expression"
          value={expression}
          readOnly
        />
      </div>
      <p><strong>Result:</strong> {result}</p>

      {/* Calculator Button Layout */}
      <div className="calculator-buttons">
        <div className="row">
          <button className="btn btn-calculator" onClick={() => handleButtonClick('7')}>7</button>
          <button className="btn btn-calculator" onClick={() => handleButtonClick('8')}>8</button>
          <button className="btn btn-calculator" onClick={() => handleButtonClick('9')}>9</button>
          <button className="btn btn-calculator" onClick={() => handleButtonClick('/')}>/</button>
        </div>
        <div className="row">
          <button className="btn btn-calculator" onClick={() => handleButtonClick('4')}>4</button>
          <button className="btn btn-calculator" onClick={() => handleButtonClick('5')}>5</button>
          <button className="btn btn-calculator" onClick={() => handleButtonClick('6')}>6</button>
          <button className="btn btn-calculator" onClick={() => handleButtonClick('*')}>*</button>
        </div>
        <div className="row">
          <button className="btn btn-calculator" onClick={() => handleButtonClick('1')}>1</button>
          <button className="btn btn-calculator" onClick={() => handleButtonClick('2')}>2</button>
          <button className="btn btn-calculator" onClick={() => handleButtonClick('3')}>3</button>
          <button className="btn btn-calculator" onClick={() => handleButtonClick('-')}>-</button>
        </div>
        <div className="row">
          <button className="btn btn-calculator" onClick={() => handleButtonClick('0')}>0</button>
          <button className="btn btn-calculator" onClick={() => handleButtonClick('.')}>.</button>
          <button className="btn btn-calculator" onClick={calculate}>=</button>
          <button className="btn btn-calculator" onClick={() => handleButtonClick('+')}>+</button>
        </div>
        <div className="row">
          {/* Backspace Button */}
          <button className="btn btn-calculator" onClick={handleBackspace}>←</button>
        </div>
      </div>

      <div className="mt-3">
        {/* Clear button */}
        <button className="btn btn-danger" onClick={clear}>Clear</button>
      </div>

      <h3>History</h3>
<ul className="list-group">
  {history.map((item, i) => {
    const createdAt = new Date(item.created_at);
    const year = createdAt.getFullYear();
    const month = String(createdAt.getMonth() + 1).padStart(2, '0');
    const day = String(createdAt.getDate()).padStart(2, '0');

    let hours = createdAt.getHours();
    const minutes = String(createdAt.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12;

    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes} ${ampm}`;

    return (
      <li key={i} className="list-group-item position-relative">
        {item.expression} = {item.result}
        <div className="text-center mt-1">
          <small className="text-muted">{formattedDateTime}</small>
        </div>
        <button
          onClick={() => deleteHistoryItem(item.id)}
          className="btn btn-danger btn-sm position-absolute end-0 top-50 translate-middle-y"
        >
          Delete
        </button>
      </li>
    );
  })}
</ul>



      {/* Inline CSS */}
      <style jsx>{`
        /* Style for the calculator's overall layout */
        .calculator-container {
          text-align: center;
        }

        .calculator-buttons {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 20px;
        }

        .row {
          display: flex;
          gap: 10px;
          justify-content: center;
        }

        .btn-calculator {
          font-size: 1.5rem;
          padding: 20px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: none;
          background-color: #f0f0f0;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
        }

        .btn-calculator:hover {
          background-color: #e0e0e0;
          box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
        }

        .btn-calculator:active {
          background-color: #d0d0d0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        input.form-control {
          font-size: 2rem;
          text-align: right;
          padding: 10px;
          height: 60px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        /* Style for the result */
        p {
          font-size: 1.5rem;
          font-weight: bold;
        }

        /* Style for Delete Button */
        .btn-danger {
          font-size: 0.75rem;
        }
      `}</style>
    </div>
  );
}

export default Calculator;
