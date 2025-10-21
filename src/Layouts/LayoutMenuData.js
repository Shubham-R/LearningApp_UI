import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navdata = () => {
  const history = useNavigate();
  //state data
  const [isDashboard, setIsDashboard] = useState(false);
  const [isCourses, setIsCourses] = useState(false);

  const [iscurrentState, setIscurrentState] = useState("Dashboard");

  function updateIconSidebar(e) {
    if (e && e.target && e.target.getAttribute("subitems")) {
      const ul = document.getElementById("two-column-menu");
      const iconItems = ul.querySelectorAll(".nav-icon.active");
      let activeIconItems = [...iconItems];
      activeIconItems.forEach((item) => {
        item.classList.remove("active");
        var id = item.getAttribute("subitems");
        if (document.getElementById(id))
          document.getElementById(id).classList.remove("show");
      });
    }
  }

  useEffect(() => {
    document.body.classList.remove("twocolumn-panel");
    if (iscurrentState !== "Dashboard") {
      setIsDashboard(false);
    }
    if (iscurrentState !== "Courses") {
      setIsCourses(false);
    }
  }, [
    history,
    iscurrentState,
    isDashboard,
    isCourses,
  ]);

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboards",
      icon: "ri-dashboard-2-line",
      link: "/dashboard",
      stateVariables: isDashboard,
      click: function (e) {
        e.preventDefault();
        setIsDashboard(!isDashboard);
        setIscurrentState("Dashboard");
        updateIconSidebar(e);
      },
    },
    {
      id: "courses",
      label: "Courses",
      icon: "ri-apps-2-line",
      link: "/courses",
      click: function (e) {
        e.preventDefault();
        setIsCourses(!isCourses);
        setIscurrentState("Courses");
        updateIconSidebar(e);
      },
      stateVariables: isCourses,
    },
  ];
  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;
