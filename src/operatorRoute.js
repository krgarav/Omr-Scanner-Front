import Index from "views/Index.js";

import Settings from "views/Settings";
import JobQueue from "views/JobQueue";


var operatorRoute = [
    {
        path: "/index",
        name: "Dashboard",
        icon: "ni ni-tv-2 text-primary",
        component: <Index />,
        layout: "/operator",
    },


    {
        path: "/job-queue",
        name: "Job Queue",
        icon: "ni ni-collection text-red",
        component: <JobQueue />,
        layout: "/operator",
    },

    {
        path: "/setting",
        name: "Settings",
        icon: "ni ni-settings-gear-65 text-primary",
        component: <Settings />,
        layout: "/operator",
    },



];
export default operatorRoute;
