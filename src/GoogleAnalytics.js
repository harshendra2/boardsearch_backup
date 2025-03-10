import ReactGA from "react-ga4";

const TRACKING_ID = "G-2CWM3F54PG";
ReactGA.initialize(TRACKING_ID);

const TrackPageView = () => {
  ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  return null;
};

export default TrackPageView;
