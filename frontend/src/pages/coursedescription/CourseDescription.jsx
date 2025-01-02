import React, { useEffect, useState } from "react";
import "./coursedescription.css";
import { useNavigate, useParams } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import { server } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { UserData } from "../../context/UserContext";
import Loading from "../../components/loading/Loading";
import { FiClock, FiBook, FiUsers } from "react-icons/fi";

const CourseDescription = ({ user }) => {
  const params = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { fetchUser } = UserData();
  const { fetchCourse, course, fetchCourses, fetchMyCourse } = CourseData();

  useEffect(() => {
    fetchCourse(params.id);
  }, []);

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const checkoutHandler = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          toast.error("Payment gateway failed to load. Please try again later.");
          setLoading(false);
          return;
        }
      }

      // Create order
      const { data } = await axios.post(
        `${server}/api/checkout/${params.id}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          withCredentials: true
        }
      );

      if (!data.success) {
        toast.error(data.message || "Could not create order");
        setLoading(false);
        return;
      }

      const options = {
        key: "rzp_test_yGKeiSezHx0H7U", // Your Razorpay key
        amount: data.order.amount,
        currency: "INR",
        name: "E learning",
        description: "Learn with us",
        order_id: data.order.id,
        handler: async function (response) {
          try {
            const verificationData = await axios.post(
              `${server}/api/verification/${params.id}`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
                withCredentials: true
              }
            );

            if (verificationData.data.success) {
              await fetchUser();
              await fetchCourses();
              await fetchMyCourse();
              toast.success("Payment successful!");
              navigate(`/payment-success/${response.razorpay_payment_id}`);
            } else {
              toast.error(verificationData.data.message || "Payment verification failed");
            }
          } catch (error) {
            console.error("Verification error:", error);
            toast.error(error.response?.data?.message || "Payment verification failed");
          }
          setLoading(false);
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          },
          escape: true,
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: {
          color: "#3B82F6",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response) {
        toast.error("Payment failed. Please try again.");
        setLoading(false);
      });
      razorpay.open();
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          {course && (
            <div className="course-description-page">
              <div className="course-description-container">
                <div className="course-description-header">
                  <h1>{course.title}</h1>
                  <div className="course-meta">
                    <div className="meta-item">
                      <FiClock />
                      <span>{course.duration} hours</span>
                    </div>
                    <div className="meta-item">
                      <FiBook />
                      <span>{course.category}</span>
                    </div>
                    <div className="meta-item">
                      <FiUsers />
                      <span>By {course.createdBy}</span>
                    </div>
                  </div>
                </div>

                <div className="course-description-content">
                  <div className="description-section">
                    <h2>About this course</h2>
                    <p>{course.description}</p>
                  </div>

                  <div className="course-enroll">
                    <div className="price-section">
                      <h3>Price</h3>
                      <p className="price">₹{course.price}</p>
                    </div>
                    <button
                      onClick={checkoutHandler}
                      disabled={loading}
                      className="enroll-button"
                    >
                      {loading ? "Processing..." : "Enroll Now"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default CourseDescription;
