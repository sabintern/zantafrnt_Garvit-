import MessageList from "./Messages/List";
import MessageDetails from "./Messages/Detail";
import { Spin } from "antd";
import { useSelector } from "react-redux";
import './Messages.css';

const Messages = () => {
  const { messages, status } = useSelector((state) => state.inbox);

  return (

    status === 'loading' ?
      <div className="loader">
        <Spin size="large" />
      </div>
      : <>
        <MessageList />
        <MessageDetails />
      </>



  );
};

export default Messages;
