import React, { useEffect, useState } from "react";
import "./users.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../main";
import Layout from "../Utils/Layout";
import toast from "react-hot-toast";
import { UserCircle2, ShieldAlert, Shield, Search } from 'lucide-react';
import { UserData } from "../../context/UserContext";

const AdminUsers = () => {
  const navigate = useNavigate();
  const { user } = UserData();
  const [users, setUsers] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.mainrole !== "superadmin") {
      navigate("/");
      return;
    }
    fetchUsers();
  }, [user, navigate]);

  async function fetchUsers() {
    try {
      setLoading(true);
      const { data } = await axios.get(`${server}/api/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true
      });

      if (data.success === false) {
        toast.error(data.message);
        return;
      }

      setUsers(data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }

  const updateRole = async (id) => {
    if (window.confirm("Are you sure you want to update this user's role?")) {
      try {
        const { data } = await axios.put(
          `${server}/api/user/${id}`,
          {},
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true
          }
        );

        toast.success(data.message);
        fetchUsers();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to update role");
      }
    }
  };

  // Filter users based on email search
  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchEmail.toLowerCase())
  );

  if (loading) {
    return (
      <Layout>
        <div className="loading">Loading users...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="users">
        <div className="users-header">
          <h1>User Management</h1>
          <p>Manage user roles and permissions</p>
        </div>
        
        {/* Search Bar */}
        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="email"
            placeholder="Search by email..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="search-input"
          />
        </div>

        {filteredUsers.length > 0 ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>
                      <div className="user-info">
                        <UserCircle2 className="user-icon" />
                        <span>{user.name}</span>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <div className="role-badge">
                        {user.role === 'admin' ? (
                          <>
                            <ShieldAlert className="role-icon admin" />
                            <span>Admin</span>
                          </>
                        ) : (
                          <>
                            <Shield className="role-icon user" />
                            <span>User</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td>
                      <button
                        onClick={() => updateRole(user._id)}
                        className="role-button"
                      >
                        Make {user.role === "admin" ? "User" : "Admin"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-users">
            <p>No users found</p>
            {searchEmail && <p>Try a different search term</p>}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminUsers;
