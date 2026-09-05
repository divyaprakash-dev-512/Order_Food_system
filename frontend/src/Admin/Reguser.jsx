import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../admincss/rg.css";

const API_BASE_URL = "https://order-food-backend-nfua.onrender.com";

export default function RegisterUser() {
  const [regUsersData, setRegUsersData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/show-all-users`);
      setRegUsersData(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return regUsersData.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toUpperCase().includes(searchTerm.toUpperCase())
    );
  }, [regUsersData, searchTerm]);

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="reguser-main-wrapper">
      <h1 className="reguser-heading-title">Registered Users List</h1>

      <div className="reguser-toolbar">
        <input
          type="text"
          placeholder="Search user..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="reguser-search"
        />
      </div>

      <table className="reguser-table-main">
        <thead>
          <tr className="reguser-table-head-row">
            <th className="reguser-th">#</th>
            <th className="reguser-th">Name</th>
            <th className="reguser-th">Email</th>
            <th className="reguser-th">Role</th>
            <th className="reguser-th">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.map((singleUser, index) => (
            <tr className="reguser-table-body-row" key={singleUser._id}>
              <td className="reguser-td">{index + 1}</td>
              <td className="reguser-td">{singleUser.name}</td>
              <td className="reguser-td">{singleUser.email}</td>
              <td className="reguser-td">
                <span className="reguser-role-chip">{singleUser.role}</span>
              </td>
              <td className="reguser-td">
                <Link
                  to={`/reg-users/edit/${singleUser._id}`}
                  className="reguser-edit-btn"
                >
                  Edit
                </Link>
                <button
                  className="reguser-delete-btn"
                  onClick={() => handleDeleteUser(singleUser._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
