import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useLazyQuery, gql } from '@apollo/client';
import { Search, BookOpen, IndianRupee } from "lucide-react";
import Loading from "../../components/loading/Loading";
import toast from "react-hot-toast";
import { CourseData } from "../../context/CourseContext";
import { server } from "../../main";
import debounce from 'lodash/debounce';
import "./courses.css";

// GraphQL Queries
const GET_ALL_COURSES = gql`
  query GetAllCourses {
    courses {
      _id
      title
      description
      price
      image
      instructor {
        name
      }
      rating
      enrolledCount
    }
  }
`;

const SEARCH_COURSES = gql`
  query SearchCourses($searchTerm: String!) {
    searchCourses(searchTerm: $searchTerm) {
      _id
      title
      description
      price
      image
      instructor {
        name
      }
      rating
      enrolledCount
    }
  }
`;

const Courses = () => {
  const navigate = useNavigate();
  const { purchaseCourse } = CourseData();
  const [searchTerm, setSearchTerm] = useState("");

  // Query for all courses initially
  const { loading: allCoursesLoading, data: allCoursesData, error: allCoursesError } = useQuery(GET_ALL_COURSES);

  // Lazy query for search
  const [searchCourses, { loading: searchLoading, data: searchData, error: searchError }] = useLazyQuery(SEARCH_COURSES, {
    fetchPolicy: 'network-only'
  });

  // Debounced search function
  const debouncedSearch = debounce((term) => {
    if (term.trim()) {
      searchCourses({ variables: { searchTerm: term } });
    }
  }, 300);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleEnroll = async (e, courseId) => {
    e.stopPropagation();
    try {
      await purchaseCourse(courseId);
    } catch (error) {
      toast.error("Failed to initiate enrollment");
    }
  };

  const formatPrice = (price) => {
    if (typeof price !== 'number' || isNaN(price)) {
      return '₹0';
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Handle errors
  if (allCoursesError) {
    console.error('Error fetching courses:', allCoursesError);
    toast.error('Failed to fetch courses');
  }

  if (searchError) {
    console.error('Error searching courses:', searchError);
    toast.error('Search failed');
  }

  const courses = searchTerm.trim() 
    ? (searchData?.searchCourses || [])
    : (allCoursesData?.courses || []);

  const loading = allCoursesLoading || searchLoading;

  if (loading) return <Loading />;

  return (
    <div className="courses-page">
      <div className="courses-container">
        <div className="courses-header">
          <h1 className="courses-title">Explore Our Courses</h1>
          <p className="courses-subtitle">
            Discover a wide range of courses designed to help you grow professionally
            and personally.
          </p>
        </div>

        <div className="search-box">
          <Search size={20} color="white" />
          <input
            type="text"
            placeholder="Search courses..."
            className="search-input"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="courses-grid">
          {courses.map((course) => (
            <div
              key={course._id}
              className="course-card"
              onClick={() => navigate(`/course/${course._id}`)}
            >
              <div className="course-image-container">
                <img
                  src={`${server}/${course.image}`}
                  alt={course.title}
                  className="course-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-course.jpg';
                  }}
                />
              </div>
              <div className="course-content">
                <h3 className="course-title">{course.title}</h3>
                {course.instructor && (
                  <p className="course-instructor">By {course.instructor.name}</p>
                )}
                <div className="course-stats">
                  <span className="course-rating">⭐ {course.rating || 0}</span>
                  <span className="course-enrolled">{course.enrolledCount || 0} enrolled</span>
                </div>
                <div className="course-footer">
                  <div className="course-price">
                    <IndianRupee size={20} />
                    {formatPrice(course.price)}
                  </div>
                  <button 
                    className="enroll-button"
                    onClick={(e) => handleEnroll(e, course._id)}
                  >
                    <BookOpen size={18} />
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {courses.length === 0 && (
          <div className="no-courses">
            <h3>No courses found</h3>
            <p>Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
