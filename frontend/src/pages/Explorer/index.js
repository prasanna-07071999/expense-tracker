import { useEffect, useState } from "react";
import api from "../../services/api";
import "./index.css";

const initialForm = {
  title: "",
  amount: "",
  category: "",
  date: "",
  notes: ""
};

const Explorer = () => {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Form
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  // View Modal
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const buildQuery = (reset) => {
    const params = new URLSearchParams();
    params.append("page", reset ? 1 : page);
    params.append("limit", 5);

    if (search) params.append("search", search);
    if (categoryFilter) params.append("category", categoryFilter);
    if (min) params.append("min", min);
    if (max) params.append("max", max);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    return `?${params.toString()}`;
  };

  const fetchTransactions = async (reset = false) => {
    try {
      const query = buildQuery(reset);
      const data = await api(`/transactions${query}`);

      if (reset) {
        setTransactions(data.transactions);
      } else {
        setTransactions((prev) => [...prev, ...data.transactions]);
      }

      setTotalPages(data.pages);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchTransactions(true);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (page > 1) fetchTransactions();
    // eslint-disable-next-line
  }, [page]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api(`/transactions/${editingId}`, "PUT", formData);
      } else {
        await api("/transactions", "POST", formData);
      }

      setFormData(initialForm);
      setEditingId(null);
      setPage(1);
      fetchTransactions(true);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEdit = (t) => {
    setEditingId(t._id);
    setFormData({
      title: t.title,
      amount: t.amount,
      category: t.category,
      date: t.date.split("T")[0],
      notes: t.notes || ""
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    try {
      await api(`/transactions/${id}`, "DELETE");
      setPage(1);
      fetchTransactions(true);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleApplyFilters = () => {
    setPage(1);
    fetchTransactions(true);
  };

  const handleView = (transaction) => {
    setSelectedTransaction(transaction);
    setShowModal(true);
  };

  return (
    <div className="explorer-container">
      <h2>Transaction Explorer</h2>

      {/* Add / Edit Form */}
      <div className="form-card">
        <h3>{editingId ? "Edit Transaction" : "Add Transaction"}</h3>
        <form onSubmit={handleSubmit}>
          <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
          <input type="number" name="amount" placeholder="Amount" value={formData.amount} onChange={handleChange} required />
          <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} required />
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          <textarea name="notes" placeholder="Notes (optional)" value={formData.notes} onChange={handleChange} />
          <button type="submit">{editingId ? "Update" : "Add"}</button>
        </form>
      </div>

      {/* Filters */}
      <div className="filters">
        <input placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
        <input placeholder="Category" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} />
        <input type="number" placeholder="Min Amount" value={min} onChange={(e) => setMin(e.target.value)} />
        <input type="number" placeholder="Max Amount" value={max} onChange={(e) => setMax(e.target.value)} />
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        <button onClick={handleApplyFilters}>Apply Filters</button>
      </div>

      {/* Transaction List */}
      <div className="transaction-list">
        {transactions.length === 0 && <p className="empty">No transactions found</p>}

        {transactions.map((t) => (
          <div key={t._id} className="transaction-card">
            <div>
              <strong>{t.title}</strong>
              <p>{t.category}</p>
              <small>{new Date(t.date).toLocaleDateString()}</small>
            </div>

            <div className="right-section">
              <span className="amount">₹ {t.amount}</span>
              <button onClick={() => handleView(t)}>View</button>
              <button onClick={() => handleEdit(t)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(t._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {page < totalPages && (
        <button className="load-more" onClick={() => setPage(page + 1)}>
          Load More
        </button>
      )}

      {/* View Details Modal */}
      {showModal && selectedTransaction && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Transaction Details</h3>
            <p><strong>Title:</strong> {selectedTransaction.title}</p>
            <p><strong>Amount:</strong> ₹ {selectedTransaction.amount}</p>
            <p><strong>Category:</strong> {selectedTransaction.category}</p>
            <p><strong>Date:</strong> {new Date(selectedTransaction.date).toLocaleDateString()}</p>
            <p><strong>Notes:</strong> {selectedTransaction.notes || "No notes"}</p>

            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Explorer;