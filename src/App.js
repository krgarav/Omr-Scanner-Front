import React, { useContext, useEffect, useState } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import AdminLayout from "layouts/Admin.js";
import Operator from "layouts/Operator";
import AuthLayout from "layouts/Auth.js";
import Moderator from "layouts/Moderator";
import IpModal from "ui/IpChange";
import axios from "axios";
import { getUrls } from "helper/url_helper";
import DataContext from "store/DataContext";
import { fetchAllTemplate } from "helper/TemplateHelper";
import TextLoader from "loaders/TextLoader";
import { toast } from "react-toastify";
import Template from "views/Template";
const useTokenRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const tokenExp = decoded.exp * 1000; // Convert exp from seconds to milliseconds

        // Get the current time in milliseconds
        const currentTime = Date.now();
        if (currentTime >= tokenExp) {
          console.log("Token has expired");
          alert("Session has expired, Please login again.");
          localStorage.clear();
          setTimeout(() => {
            navigate("/auth/login", { replace: true });
          }, 100);
       
        }
        if (decoded.Role === "Operator") {
          if (location.pathname.includes("operator")) {
            navigate(location.pathname);
          } else {
            navigate("/operator/index", { replace: true });
          }
        } else if (decoded.Role === "Admin") {
          if (location.pathname.includes("admin")) {
            navigate(location.pathname);
          } else {
            navigate("/admin/index", { replace: true });
          }
        } else if (decoded.Role === "Moderator") {
          if (location.pathname.includes("moderator")) {
            navigate(location.pathname);
          } else {
            navigate("/moderator/index", { replace: true });
          }
        }
      } catch (error) {
        console.error("Invalid token:", error);
        navigate("/auth/login", { replace: true });
      }
    } else {
      navigate("/auth/login", { replace: true });
    }
  }, [location.pathname]);
};

const App = () => {
  const [showIpModal, setShowIpModal] = useState(false);
  const [templateLoading, setTemplateLoading] = useState(true); // State to manage loading
  const dataCtx = useContext(DataContext); // Assuming you are using context
  const toggle = true;
  useEffect(() => {
    if (dataCtx.allTemplates.length === 0) {
      const fetchData = async () => {
        setTemplateLoading(true);
        try {
          const templates = await fetchAllTemplate();
          if (!templates) {
            throw new Error("Error fetching templates");
          }
          const mpObj = templates.map((item) => {
            return [{ layoutParameters: item }];
          });
          dataCtx.addToAllTemplate(mpObj);
        } catch (error) {
          toast.error(error.message || "Error fetching templates");
        } finally {
          setTemplateLoading(false);
        }
      };
      fetchData();
    }
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response2 = await getUrls();
        const getUserUrl = response2?.GET_USERS;

        if (!getUserUrl) {
          throw new Error("GET_USERS URL is not defined in configuration");
        }

        // Perform the GET request to fetch user data
        const getUserResponse = await fetch(getUserUrl);

        if (!getUserResponse.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await getUserResponse.json();
        console.log(userData);

        // Handle successful fetch here
      } catch (error) {
        console.error("Error fetching data:", error);
        setShowIpModal(true); // Show the modal or handle the error as needed
      }
    };

    fetchData();
  }, []);

  const handleSaveIp = (ip, protocol) => {
    const Obj = {
      backendUrl: ip,
    };
    const res2 = axios.post("http://localhost/api/config", Obj);

    setTimeout(() => {
      window.location.reload(); // Reload the page
    }, 400);
  };

  // useTokenRedirect();

  // if (templateLoading) {
  //   return <TextLoader message={"Loading, Please wait..."} />; // Show loader while fetching templates
  // }
  return (
    <>
      {/* <IpModal
        show={showIpModal}
        onHide={() => setShowIpModal(false)}
        onSave={handleSaveIp}
      /> */}

      <Routes>
        <Route path="/admin/*" element={<AdminLayout />} />
        <Route path="/operator/*" element={<Operator />} />
        <Route path="/moderator/*" element={<Moderator />} />
        <Route path="/auth/*" element={<AuthLayout />} />
        {/* <Route path="/" element={<Template />} /> */}
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </>
  );
};

export default App;
