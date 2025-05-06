import React from 'react'
import { useLocation, Route, Routes, Navigate } from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";
// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import operatorRoute from "operatorRoute.js";

import FolderStructure from "views/FolderStructure";
import ScanJob from 'views/ScanJob';


const Operator = (props) => {
    const mainContent = React.useRef(null);
    const location = useLocation();

    React.useEffect(() => {
        document.documentElement.scrollTop = 0;
        document.scrollingElement.scrollTop = 0;
        mainContent.current.scrollTop = 0;
    }, [location]);

    const getRoutes = (operatorRoute) => {
        return operatorRoute.map((prop, key) => {
            if (prop.layout === "/operator") {
                return (
                    <Route path={prop.path} element={prop.component} key={key} exact />
                );
            } else {
                return null;
            }
        });
    };

    const getBrandText = (path) => {
        for (let i = 0; i < operatorRoute.length; i++) {
            if (
                props?.location?.pathname.indexOf(operatorRoute[i].layout + operatorRoute[i].path) !==
                -1
            ) {
                return operatorRoute[i].name;
            }
        }
        return "Brand";
    };
    return (
        <>
            <Sidebar
                {...props}
                routes={operatorRoute}
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
                    {getRoutes(operatorRoute)}

                    <Route path="*" element={<Navigate to="/operator/index" replace />} />
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