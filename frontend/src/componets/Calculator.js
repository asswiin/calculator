import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/calculator.css";

export default function Calculator() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);

  const handleClick = (val) => setInput(input + val);
  const clear = () => setInput("");
  
  const calculate = async () => {
    try {
      const result = eval(input).toString();
      setInput(result);
      await axios.post("/api/calculations", {
        expression: input,
        result
      });
      getHistory();
    } catch {
      setInput("Error");
    }
  };

  const getHistory = async () => {
    const res = await axios.get("/api/calculations");
    setHistory(res.data);
  };

  useEffect(() => {
    getHistory();
  }, []);

  return (
    <div className="calculator">
      <h2 className="title">MERN Calculator</h2>
      <input className="display" type="text" value={input} readOnly />
      <div className="keypad">
        {["7","8","9","/","4","5","6","*","1","2","3","-","0",".","=","+"].map((val) => {
          const isOperator = /[/*\-+]/.test(val);
          const isEqual = val === "=";
          const cls = isEqual ? "btn equal" : isOperator ? "btn operator" : "btn";
          return (
            <button
              key={val}
              className={cls}
              onClick={() => (val === "=" ? calculate() : handleClick(val))}
            >
              {val}
            </button>
          );
        })}
        <button className="btn clear" onClick={clear}>Clear</button>
      </div>
      <h3 className="history-title">History</h3>
      <ul className="history">
        {history.map((h, index) => (
          <li key={index} className="history-item">{h.expression} = {h.result}</li>
        ))}
      </ul>
    </div>
  );
}