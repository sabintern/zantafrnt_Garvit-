import React, { useEffect } from "react";
import { Layout } from "antd";
import Messages from "./Inbox";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages } from "../../features/inbox/inboxSlice";
import Sidebar from "./Sidebar";
import HelpAndSupport from "../HelpAndSupport";
import Settings from "../Settings";
import Pricing from "../Pricing";
import Calendar from "./Calendar";
import {
  fetchProfile,
  fetchWorkingHours,
} from "../../features/profile/profileSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { activeTab } = useSelector((state) => state.menu);

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchMessages(0));
  }, []);

  return (
    <Layout style={{ height: "100vh" }}>
      <Sidebar />
      {activeTab[0] === "inbox" && <Messages />}
      {/* {activeTab[0] === "settings" && <Settings />}
      {activeTab[0] === "calendar" && <Calendar />}
      {activeTab[0] === "pricingDetails" && <Pricing />} */}
      <HelpAndSupport />
    </Layout>
  );
};

export default Dashboard;
