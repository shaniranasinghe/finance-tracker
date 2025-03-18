import React from "react";
import { useEffect, useState } from "react";
import { getBudgets, getRecommendations, getNotifications } from "../services/api";

const Dashboard = () => {
  const [budgets, setBudgets] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const budgetData = await getBudgets();
      const recommendationData = await getRecommendations();
      const notificationData = await getNotifications();
      setBudgets(budgetData.data);
      setRecommendations(recommendationData.data);
      setNotifications(notificationData.data.notifications);
    };
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      
      {/* Budgets */}
      <h3 className="text-xl font-semibold mt-4">Budgets</h3>
      <ul className="list-disc pl-6">
        {budgets.map((budget) => (
          <li key={budget._id}>{budget.category}: ${budget.amount}</li>
        ))}
      </ul>

      {/* Recommendations */}
      <h3 className="text-xl font-semibold mt-4">Recommendations</h3>
      <ul className="list-disc pl-6">
        {recommendations.map((rec) => (
          <li key={rec.category}>{rec.category} - {rec.recommendation}</li>
        ))}
      </ul>

      {/* Notifications */}
      <h3 className="text-xl font-semibold mt-4">Notifications</h3>
      <ul className="list-disc pl-6">
        {notifications.map((notification) => (
          <li key={notification._id}>{notification.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
