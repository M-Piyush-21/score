import axios from "axios";
import { createContext, useContext, useState, useCallback } from "react";
import { server } from "../main";
import toast from "react-hot-toast";

const CourseContext = createContext();

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  } : {
    'Content-Type': 'application/json'
  };
};

export const CourseContextProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState(null);
  const [mycourse, setMyCourse] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleAxiosError = (error, defaultMessage) => {
    console.error(defaultMessage, error);
    if (error.response?.status === 401) {
      toast.error("Please login to continue");
      window.location.href = "/login";
      return;
    }
    if (error.code === "ERR_NETWORK") {
      toast.error("Unable to connect to server. Please check your connection.");
    } else {
      toast.error(error.response?.data?.message || defaultMessage);
    }
  };

  const purchaseCourse = async (courseId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to purchase the course");
      window.location.href = "/login";
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${server}/api/course/checkout/${courseId}`,
        {},
        {
          headers: getAuthHeaders(),
          withCredentials: true
        }
      );

      console.log("Checkout response:", data);

      if (data.success) {
        const options = {
          key: "rzp_test_yGKeiSezHx0H7U",
          amount: data.order.amount,
          currency: "INR",
          name: "Course Purchase",
          description: data.course.title,
          order_id: data.order.id,
          handler: async function (response) {
            try {
              console.log("Payment response:", response);
              const verificationData = {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              };

              const verificationResponse = await axios.post(
                `${server}/api/verification/${courseId}`,
                verificationData,
                {
                  headers: getAuthHeaders(),
                  withCredentials: true
                }
              );

              if (verificationResponse.data.success) {
                toast.success("Course purchased successfully!");
                window.location.href = `/dashboard`;
              }
            } catch (error) {
              console.error("Payment verification error:", error);
              handleAxiosError(error, "Payment verification failed");
            }
          },
          prefill: {
            name: localStorage.getItem("name") || "",
            email: localStorage.getItem("email") || "",
          },
          theme: {
            color: "#2563eb"
          }
        };

        console.log("Razorpay options:", options);
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        toast.error(data.message || "Failed to initiate purchase");
      }
    } catch (error) {
      console.error("Purchase error:", error);
      handleAxiosError(error, "Error purchasing course");
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${server}/api/course/all`, {
        headers: getAuthHeaders(),
        withCredentials: true
      });

      if (data.success && data.courses) {
        setCourses(data.courses);
      } else {
        toast.error(data.message || "Failed to fetch courses");
      }
    } catch (error) {
      handleAxiosError(error, "Error fetching courses");
    } finally {
      setLoading(false);
    }
  };

  const fetchCourse = useCallback(async (id) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${server}/api/course/${id}`, {
        headers: getAuthHeaders(),
        withCredentials: true
      });
      
      if (data.success && data.course) {
        setCourse(data.course);
        return data.course;
      } else {
        const errorMsg = data.message || "Failed to fetch course details";
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Error fetching course details";
      handleAxiosError(error, errorMsg);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyCourses = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${server}/api/mycourse`, {
        headers: getAuthHeaders(),
        withCredentials: true
      });
      
      if (data.success && data.courses) {
        setMyCourse(data.courses);
      } else {
        toast.error(data.message || "Failed to fetch your courses");
      }
    } catch (error) {
      handleAxiosError(error, "Error fetching your courses");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${server}/api/course/student/stats`, {
        headers: getAuthHeaders(),
        withCredentials: true
      });
      
      if (data.success) {
        setStats(data.stats);
      } else {
        toast.error(data.message || "Failed to fetch statistics");
      }
    } catch (error) {
      handleAxiosError(error, "Error fetching statistics");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CourseContext.Provider
      value={{
        courses,
        course,
        mycourse,
        stats,
        loading,
        fetchCourses,
        fetchCourse,
        fetchMyCourses,
        fetchStats,
        purchaseCourse
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const CourseData = () => {
  return useContext(CourseContext);
};
