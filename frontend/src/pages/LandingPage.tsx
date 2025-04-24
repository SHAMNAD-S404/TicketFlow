import React from "react";
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

const LandingPage: React.FC = () => {
  const faqData = [
    {
      question: "How this UI Kit is different from others in market?",
      answer:
        "This UI Kit offers a seamless user experience with unique components, easy-to-use designs, and high flexibility.",
    },
    {
      question: "How long do you provide support?",
      answer:
        "We provide lifetime support for all our customers after purchase.",
    },
    {
      question: "Do I need any experience to work with this kit?",
      answer:
        "No, you can use this kit without prior design or development experience.",
    },
    {
      question: "What kind of files are included?",
      answer:
        "The kit includes Figma, Sketch, and Adobe XD files for all components.",
    },
  ];

  return (
    <div>
      <LandingNavbar />

      <HeroSection
        heading="Streamline Communication with Our IT Ticketing System"
        text="Our IT Ticketing System enhances inter-departmental collaboration by providing a seamless platform for 
            reporting and resolving issues. With real-time updates, chat functionality, and comprehensive analytics, 
            teams can work together more efficiently and effectively."
        image={heroImage}
      />

      <HeroSection
        heading="Great Customer Service starts with a Powerful Helpdesk Software"
        text="Is it one of those days? Sticky notes all over and the phone won’t stop  ringing?  
              TicketFlow is the helpdesk software of the future and helps you findstructure in the chaos.
              Connect all your communication channels, easily grant user rights, and receive helpful reporting.
              Have everything under control  and your customers under your spell. Discover the TicketFlow ticketing system now!"
        image={desktopTeam}
        reverse={true}
      />

      <FeatureSession />

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

      <Footer />
      <ChatBot/>
    </div>
  );
};

export default LandingPage;
