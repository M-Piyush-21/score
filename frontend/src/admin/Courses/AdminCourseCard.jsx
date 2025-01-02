import React, { useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import axios from 'axios';
import { server } from '../../main';
import toast from 'react-hot-toast';

const AdminCourseCard = ({ course, onEdit, onDelete, refetch }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.delete(`${server}/api/course/${course._id}`, {
        headers: {
          token: localStorage.getItem('token'),
        },
      });
      toast.success(data.message);
      refetch();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="course-card">
      {course.poster && course.poster.url && (
        <img 
          src={course.poster.url} 
          alt={course.title}
          className="course-image" 
        />
      )}
      
      <div className="course-content">
        <h3 className="course-title">{course.title}</h3>
        <p className="course-description">{course.description}</p>
        
        <div className="course-meta">
          <span className="course-category">{course.category}</span>
          <span className="course-duration">{course.duration}</span>
          <span className="course-price">₹{course.price}</span>
        </div>

        <div className="course-actions">
          <button 
            onClick={() => onEdit(course)}
            className="edit-button"
            disabled={isLoading}
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit</span>
          </button>

          <button 
            onClick={handleDelete}
            className="delete-button"
            disabled={isLoading}
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminCourseCard;
