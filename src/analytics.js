import ReactGA from "react-ga4";

const GA_TRACKING_ID = "G-2CWM3F54PG"; 

export const initGA = () => {
  ReactGA.initialize(GA_TRACKING_ID);
};

export const trackEvent = (category, action, label) => {
  ReactGA.event({
    category,
    action,
    label,
  });
};
