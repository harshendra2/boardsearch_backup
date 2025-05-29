import React, { useRef, useState } from "react";
import "./Recentappl.css";
import Ellipse from "../../assets/images/Ellipse.png";
import next from "../../assets/images/Group_next.png";
import prev from "../../assets/images/Group_prev.png";
import { Container, Image } from "react-bootstrap";
import { testimonialsData } from "../../constant/testimonials";

const RecentApplication = () => {
  const [testimonials, setTestimonialData] = useState(testimonialsData);
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <Container className="recent-app" style={{ zIndex: 1, position: "relative" }}>
      <div className="headding-body" style={{}}>
        <p className="headding" style={{ fontFamily: "Poppins" }}>
          Recent Appointments
          <svg viewBox="0 0 100 2" preserveAspectRatio="none">
            <rect width="100" height="2" />
          </svg>
        </p>
      </div>

      <div
        ref={scrollRef}
        className="testimonials-card-div align"
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "start",
          flexWrap: "nowrap",
          overflowX: "hidden",
          width: "100%",
          zIndex: 10,
          position: "relative",
          scrollBehavior: "smooth",
          paddingTop:"5px"
        }}
      >
        {testimonials &&
          testimonials.map((items, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                padding: "30px",
                position: "relative",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                minWidth: "250px", // Ensure items have a fixed width for scrolling
              }}
            >
              <div className="crads-profile">
                <Image
                  src={items.image}
                  roundedCircle
                  alt="Rounded"
                  width="200px"
                  style={{ position: "relative", zIndex: 2 }}
                />
                <Image
                  src={Ellipse}
                  width="220px"
                  style={{
                    marginTop: "-104px",
                    position: "relative",
                    zIndex: 1,
                  }}
                />
                <div style={{ marginTop: "20px" }}>
                  <p style={{ fontSize: "18px", fontWeight: "bolder", color: "#1E3449" }}>
                    {items?.name}
                  </p>
                  <p style={{ fontSize: "18px", marginTop: "-10px", color: "#1E3449" }}>
                    Serving as
                  </p>
                  <p style={{ fontSize: "18px", marginTop: "-10px", color: "#1E3449" }}>
                    {items?.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>

      <div className="SideBarButton" style={{ display: "flex", flexDirection: "row", justifyContent: "center", gap: "30px", marginTop: "-30px" }}>
  <div onClick={scrollLeft} style={{ cursor: "pointer" }}>
    <img style={{ cursor: "pointer" }} src={next} alt="Next" />
  </div>
  <div onClick={scrollRight} style={{ cursor: "pointer" }}>
    <img style={{cursor: "pointer"}} src={prev} alt="Previous" />
  </div>
</div>
    </Container>
  );
};

export default RecentApplication;
