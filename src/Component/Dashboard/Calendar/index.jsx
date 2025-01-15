import { InlineWidget } from "react-calendly";
import { Layout } from "antd";

const Calendar = () => {
  return (
    <Layout title="Contact">
      <InlineWidget
        styles={{ height: "100vh" }}
        url={`https://calendly.com/garvitjain09/30min`}
      />
    </Layout>
  );
};

export default Calendar;
