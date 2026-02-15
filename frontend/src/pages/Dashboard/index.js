import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import "./index.css";

const Dashboard = () => {
  const [data, setData] = useState({
    totalExpenses: 0,
    categoryBreakdown: [],
    recentTransactions: []
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDashboard = async () => {
    try {
      const response = await api("/dashboard");
      setData(response);
    } catch (error) {
      console.log(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="dashboard-container">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>

      {/* Total Expenses */}
      <div className="summary-card">
        <h3>Total Expenses</h3>
        <p className="total">₹ {data.totalExpenses}</p>
      </div>

      {/* Category Breakdown */}
      <div className="card">
        <h3>Category Breakdown</h3>
        {data.categoryBreakdown.length === 0 ? (
          <p>No data available</p>
        ) : (
          data.categoryBreakdown.map((item) => (
            <div key={item._id} className="category-row">
              <span>{item._id}</span>
              <span>₹ {item.total}</span>
            </div>
          ))
        )}
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="recent-header">
          <h3>Recent Transactions</h3>
          <button onClick={() => navigate("/explorer")}>
            View All
          </button>
        </div>

        {data.recentTransactions.length === 0 ? (
          <p>No recent transactions</p>
        ) : (
          data.recentTransactions.map((t) => (
            <div key={t._id} className="transaction-row">
              <div>
                <strong>{t.title}</strong>
                <p>{t.category}</p>
                <small>
                  {new Date(t.date).toLocaleDateString()}
                </small>
              </div>
              <div className="amount">₹ {t.amount}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;