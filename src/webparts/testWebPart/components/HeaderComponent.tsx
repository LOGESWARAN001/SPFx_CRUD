import * as React from "react";
import { Avatar } from "primereact/avatar";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import { TabMenu } from "primereact/tabmenu";
import { MenuItem } from "primereact/menuitem";
import { PrimeIcons } from "primereact/api";
import "./RootDesign.scss";
import { LuLayoutDashboard } from "react-icons/lu";
import { AiOutlineBars } from "react-icons/ai";
import { HiOutlineUsers } from "react-icons/hi2";
import { BsTicket } from "react-icons/bs";
import { Button } from "primereact/button";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { FaLock } from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";

import { Label } from "office-ui-fabric-react";
import styles from "@pnp/spfx-controls-react/lib/controls/iFrameDialog/IFrameDialogContent.module.scss";

const MainComponent = (UserData) => {
  const Headercls = {
    margin: 0,
    display: "flex",
    maxWidth: "100%",
    height: "50px",
    alignItems: "center",
    padding: "0px 10px 0px",
    color: "white",
    backgroundColor: "Darkblue",
  };

  const HeaderImgcls = {
    width: "30px",
    height: "30px",
    marginRight: "5px",
  };
  const HederendDesign = {
    backgroundColor: "Transparent",
    display: "flex",
    justifyContent: "end",
    alignItems: "center",
    gap: "10px",
    marginLeft: "50px",
    height: "100%",
    width: "90%",
    padding: 0,
  };
  const personpic = {
    borderRadius: "30px",
    overflow: "hidden",
    width: "35px",
    height: "35px",
    margin: "0px",
    padding: "0px",
  };
  //Menu Bar
  const pMenuitemText = {
    color: "Green",
    backgroundColor: "RGB(231, 233, 235)",
  };

  const ToggleItems: MenuItem[] = [
    { label: "Dashboard", icon: LuLayoutDashboard },
    { label: "Tickets", icon: AiOutlineBars },
    { label: "Administration", icon: HiOutlineUsers },
  ];

  const SubToggleItemsDashboard: MenuItem[] = [
    { label: "My Dashboard" },
    { label: "Global Dashboard" },
  ];

  const SubToggleItemsTicket: MenuItem[] = [
    { label: "My Tickets", icon: BsTicket },
    { label: "All Tickets", icon: AiOutlineBars },
  ];

  const ToggleItemsCls = {
    margin: 0,
  };

  //Active Menu
  const [ActiveTab, setActiveTab] = React.useState(0);
  function ToggleItemsFunc(name) {
    console.log("name", name.index);
    setActiveTab(name.index);
  }

  const [ActiveSubTicketTab, setActiveSubTicketTab] = React.useState(0);
  function ToggleTicketTab(name) {
    setActiveSubTicketTab(name.index);
  }

  return (
    <>
      <div className="main-container">
        <div style={Headercls}>
          <img
            style={HeaderImgcls}
            src={require("../assets/customer-support.png")}
          ></img>

          <h2>HELPDESK</h2>
          <div style={HederendDesign}>
            <h4>{UserData.context._pageContext._user.displayName}</h4>

            <Avatar
              style={personpic}
              image={`/_layouts/15/userphoto.aspx?size=S&username=${UserData.context._pageContext._user.email}`}
            />
          </div>
        </div>
        <div style={ToggleItemsCls}>
          <TabMenu
            model={ToggleItems}
            activeIndex={ActiveTab}
            onTabChange={(e) => {
              ToggleItemsFunc(e);
            }}
          />
        </div>
        <div style={ToggleItemsCls}>
          {ActiveTab == 0 && <TabMenu model={SubToggleItemsDashboard} />}
          {ActiveTab == 1 && (
            <TabMenu
              model={SubToggleItemsTicket}
              activeIndex={ActiveSubTicketTab}
              onTabChange={(e) => {
                ToggleTicketTab(e);
              }}
            />
          )}
        </div>

        {ActiveTab == 1 && ActiveSubTicketTab == 0 && (
          <div className="dataFilters">
            <Button label="New" icon={FaPlus} iconPos="left" />
            <Button label="Delete" icon={FaRegTrashAlt} iconPos="left" />
            <Button label="Archive" icon={FaLock} iconPos="left" />
            <Button label="Refresh" icon={IoMdRefresh} iconPos="left" />

            <div className="dataFiltersSub"></div>
          </div>
        )}
      </div>
    </>
  );
};

export default MainComponent;
