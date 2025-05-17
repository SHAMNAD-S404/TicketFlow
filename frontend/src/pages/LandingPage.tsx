import React, { useRef } from "react";
import heroImage from "../assets/images/hero-section2.png";
import desktopTeam from "../assets/images/helpdesk2.png";
import details1 from "../assets/images/detailnew.png";
import zoomCall from "../assets/images/zoomCall.png";
import dashboard from "../assets/images/dashboard.png";
import HeroSection from "../components/user/home/HeroSection";
import LandingNavbar from "../components/user/layout/landingNavbar";
import FeatureSession from "../components/user/home/FeatureSession";
import DetailFeature from "../components/user/home/DetailFeature";
import TrialComponent from "../components/user/home/TrialComponent";
import FAQComponent from "../components/user/home/FAQComponent";
import Footer from "../components/user/layout/Footer";
import ChatBot from "@/components/chatBot/ChatBot";
import { faqData } from "@/components/utility/faqData";

const LandingPage: React.FC = () => {
  const featureRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const homeRef = useRef<HTMLDivElement>(null);
  return (
    <div>
      <LandingNavbar featureRef={featureRef} aboutRef={aboutRef} homeRef={homeRef} />

      <div ref={homeRef}>
        <HeroSection
          heading="Streamline Communication with Our IT Ticketing System"
          text="O ur IT Ticketing System enhances inter-departmental collaboration by providing a seamless platform for 
            reporting and resolving issues. With real-time updates, chat functionality, and comprehensive analytics, 
            teams can work together more efficiently and effectively."
          image={heroImage}
        />
      </div>

      <HeroSection
        heading="Great Customer Service starts with a Powerful Helpdesk Software"
        text="I s it one of those days? Sticky notes all over and the phone won’t stop  ringing?  
              TicketFlow is the helpdesk software of the future and helps you find structure in the chaos.
              Connect all your communication channels, easily grant user rights, and receive helpful reporting.
              Have everything under control  and your customers under your spell. Discover the TicketFlow ticketing system now!"
        image={desktopTeam}
        reverse={true}
      />

      <div ref={featureRef}>
        <FeatureSession />
      </div>

      <DetailFeature
        header="Streamline Communication and Enhance Efficiency with Our IT Ticketing System"
        text="Our IT Ticketing System facilitates seamless interaction between departments, ensuring swift resolution of issues. Experience improved collaboration and productivity across your organization."
        subHeader1="Enhanced Collaboration"
        subText1="Departments can communicate in real-time, reducing delays and improving response times."
        subHeader2="Data Insights"
        subText2="Access valuable analytics to track performance and optimize departmental workflows."
        image={details1}
      />

      <DetailFeature
        header="Streamlined Communication with Real-Time Chat Integration for Efficient Ticket Management"
        text="Our chat integration with socket.io enhances collaboration between departments. Instantly communicate and resolve issues as they arise, ensuring a smooth workflow."
        subHeader1="Instant Messaging"
        subText1="Engage in real-time conversations to discuss ticket details and updates seamlessly."
        subHeader2="Video Calls"
        subText2="Easily initiate video calls for more complex discussions directly within the app."
        image={zoomCall}
        reverse={true}
      />

      <DetailFeature
        header="Comprehensive Admin Dashboard for Data-Driven Insights"
        text="Effortlessly monitor and evaluate departmental performance metrics, including ticket resolution capacity and average resolution time. Use these insights to identify improvement opportunities, optimize productivity, and streamline operations. Easily assign or reassign tickets and manage departments effectively to maintain smooth workflows."
        subHeader1="Performance Tracking"
        subText1="Feature: Real-time performance metrics for each department, including capacity and average ticket resolution time."
        subHeader2="Ticket and Dept-Management"
        subText2="Feature: Seamless functionality to assign and reassign tickets or departments as needed."
        image={dashboard}
      />

      <TrialComponent />

      <FAQComponent faqs={faqData} />

      <div ref={aboutRef}>
        <Footer />
      </div>
      <ChatBot />
    </div>
  );
};

export default LandingPage;
