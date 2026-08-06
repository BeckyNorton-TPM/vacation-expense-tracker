import { useEffect, useState } from "react";
import { listExpenses } from "../api";

export default function ExpenseList({ refreshKey }) {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    listExpenses()
      .then((data) => {
        if (!cancelled) setExpenses(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  if (loading) return <p>Loading expenses…</p>;
  if (error) return <p className="error">{error}</p>;
  if (expenses.length === 0) return <p>No expenses yet.</p>;

  return (
    <div className="table-wrap">
      <table className="expense-list">
        <thead>
          <tr>
            <th>Date</th>
            <th>Business</th>
            <th>Description</th>
            <th>Category</th>
            <th>Local</th>
            <th>USD</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((e) => (
            <tr key={e.id}>
              <td>{e.date}</td>
              <td>{e.business_name}</td>
              <td>{e.description}</td>
              <td>{e.category}</td>
              <td>
                {e.local_amount.toFixed(2)} {e.local_currency}
              </td>
              <td>${e.usd_amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
