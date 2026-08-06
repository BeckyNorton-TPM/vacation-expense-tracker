import { useState } from "react";
import { createExpense } from "../api";

const CATEGORIES = ["food", "lodging", "transport", "activities", "souvenirs", "other"];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function emptyForm() {
  return {
    date: todayISO(),
    business_name: "",
    description: "",
    category: CATEGORIES[0],
    local_currency: "",
    local_amount: "",
  };
}

export default function ExpenseForm({ onCreated }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await createExpense({
        ...form,
        local_currency: form.local_currency.trim().toUpperCase(),
      });
      setForm(emptyForm());
      onCreated?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <label>
        Date
        <input type="date" name="date" value={form.date} onChange={handleChange} required />
      </label>

      <label>
        Business name
        <input
          type="text"
          name="business_name"
          value={form.business_name}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Description
        <input
          type="text"
          name="description"
          value={form.description}
          onChange={handleChange}
        />
      </label>

      <label>
        Category
        <select name="category" value={form.category} onChange={handleChange}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <label>
        Currency code
        <input
          type="text"
          name="local_currency"
          value={form.local_currency}
          onChange={handleChange}
          maxLength={3}
          placeholder="EUR"
          required
        />
      </label>

      <label>
        Local amount
        <input
          type="number"
          name="local_amount"
          value={form.local_amount}
          onChange={handleChange}
          step="0.01"
          min="0.01"
          required
        />
      </label>

      {error && <p className="error">{error}</p>}

      <button type="submit" disabled={submitting}>
        {submitting ? "Saving…" : "Add expense"}
      </button>
    </form>
  );
}
