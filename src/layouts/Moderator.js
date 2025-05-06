import React from 'react'
import { useLocation, Route, Routes, Navigate } from "react-router-dom";
// reactstrap components

// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import moderatorRoute from 'moderator';

import ScanJob from 'views/ScanJob';


const Operator = (props) => {
    const mainContent = React.useRef(null);
    const location = useLocation();

    React.useEffect(() => {
        document.documentElement.scrollTop = 0;
        document.scrollingElement.scrollTop = 0;
        mainContent.current.scrollTop = 0;
    }, [location]);

    const getRoutes = (moderatorRoute) => {
        return moderatorRoute.map((prop, key) => {
            if (prop.layout === "/moderator") {
                return (
                    <Route path={prop.path} element={prop.component} key={key} exact />
                );
            } else {
                return null;
            }
        });
    };

    const getBrandText = (path) => {
        for (let i = 0; i < moderatorRoute.length; i++) {
            if (
                props?.location?.pathname.indexOf(moderatorRoute[i].layout + moderatorRoute[i].path) !==
                -1
            ) {
                return moderatorRoute[i].name;
            }
        }
        return "Brand";
    };
    return (
        <>
            <Sidebar
                {...props}
                routes={moderatorRoute}
                logo={{
                    innerLink: "/admin/index",
                    imgSrc: require("../assets/img/brand/argon-react.png"),
                    imgAlt: "...",
                }}
            />
            <div className="main-content" ref={mainContent}>
                <AdminNavbar
                    {...props}
                    brandText={getBrandText(props?.location?.pathname)}
                />
                <Routes>
                    {getRoutes(moderatorRoute)}

                    <Route path="*" element={<Navigate to="/moderator/index" replace />} />
                    <Route path="/scanjob" element={<ScanJob />} />
                </Routes>
                {/* <Container fluid>
          <AdminFooter />
        </Container> */}
            </div>
        </>
    )
}

export default Operator;