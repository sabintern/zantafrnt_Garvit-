import React from "react";
import { useSelector } from "react-redux";
import CommonProfile from "../CommonProfile";
import { updateWorkingHours } from "../../../features/profile/profileSlice";
const ProfilePage = () => {
  const { profile, status, timeZone } = useSelector((state) => state.profile);
  return (
    <CommonProfile
      pageData={profile}
      updateWorkingHours={updateWorkingHours}
      status={status}
      timeZone={timeZone}
      title="My Profile"
    />
  );
};

export default ProfilePage;
