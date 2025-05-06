import Index from "views/Index.js";
import Jobs from "views/Jobs";
import FolderStructure from "views/FolderStructure";
import ModeratorJobQueue from "views/ModeratorJobQueue";

var moderatorRoute = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/moderator",
  },
  {
    path: "/jobs",
    name: "Job Management",
    icon: "ni ni-briefcase-24 text-yellow",
    component: <Jobs />,
    layout: "/moderator",
  },
  {
    path: "/icons",
    name: "Moderator Job Queue",
    icon: "ni ni-money-coins text-yellow",
    component: <ModeratorJobQueue />,
    layout: "/moderator",
  },
  {
    path: "/server-folder",
    name: "Folder Management",
    icon: "ni ni-settings-gear-65 text-primary",
    component: <FolderStructure />,
    layout: "/moderator",
  },
];
export default moderatorRoute;
