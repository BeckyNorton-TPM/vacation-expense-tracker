import { useEffect, useState } from "react";
import { getTotals } from "../api";

export default function Totals({ refreshKey }) {
  const [totals, setTotals] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getTotals()
      .then((data) => {
        if (!cancelled) setTotals(data);
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

  if (loading) return <p>Loading totals…</p>;
  if (error) return <p className="error">{error}</p>;
  if (totals.by_category.length === 0) return <p>No expenses yet.</p>;

  return (
    <div className="table-wrap">
      <table className="totals">
        <thead>
          <tr>
            <th>Category</th>
            <th>Total (USD)</th>
          </tr>
        </thead>
        <tbody>
          {totals.by_category.map((c) => (
            <tr key={c.category}>
              <td>{c.category}</td>
              <td>${c.total_usd.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>Grand total</td>
            <td>${totals.grand_total_usd.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
