import { useState } from "react";
import { clearExpenses } from "./api";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import Totals from "./components/Totals";
import "./App.css";

const VIEWS = [
  { id: "add", label: "Add Expense" },
  { id: "list", label: "Expenses" },
  { id: "totals", label: "Totals" },
];

function App() {
  const [view, setView] = useState("add");
  const [refreshKey, setRefreshKey] = useState(0);
  const [clearError, setClearError] = useState(null);

  function handleCreated() {
    setRefreshKey((k) => k + 1);
    setView("list");
  }

  async function handleClearAll() {
    const confirmed = window.confirm(
      "Delete ALL expenses? This cannot be undone."
    );
    if (!confirmed) return;

    setClearError(null);
    try {
      await clearExpenses();
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setClearError(err.message);
    }
  }

  return (
    <div className="app">
      <header>
        <h1>Vacation Expense Tracker</h1>
        <nav>
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              className={view === v.id ? "active" : ""}
              onClick={() => setView(v.id)}
            >
              {v.label}
            </button>
          ))}
        </nav>
        <button type="button" className="danger" onClick={handleClearAll}>
          Clear all expenses
        </button>
        {clearError && <p className="error">{clearError}</p>}
      </header>
      <main>
        {view === "add" && <ExpenseForm onCreated={handleCreated} />}
        {view === "list" && <ExpenseList refreshKey={refreshKey} />}
        {view === "totals" && <Totals refreshKey={refreshKey} />}
      </main>
    </div>
  );
}

export default App;
