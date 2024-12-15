import React from 'react'
import heroImage from "../assets/images/hero-section.jpg";
import desktopTeam from "../assets/images/helpdesk.jpg"
import HeroSection from '../components/user/home/HeroSection'; 
import LandingNavbar from '../components/user/layout/landingNavbar';
import FeatureSession from '../components/user/home/FeatureSession';

const LandingPage :React.FC = () => {
  return (
    <div>

        <LandingNavbar/>

        <HeroSection
            heading='Streamline Communication with Our IT Ticketing System'
            text='Our IT Ticketing System enhances inter-departmental collaboration by providing a seamless platform for 
            reporting and resolving issues. With real-time updates, chat functionality, and comprehensive analytics, 
            teams can work together more efficiently and effectively.'
            image={heroImage}
        />

         <HeroSection
            heading='Great Customer Service starts with a Powerful Helpdesk Software'
            text='Is it one of those days? Sticky notes all over and the phone won’t stop  ringing?  
              TicketFlow is the helpdesk software of the future and helps you findstructure in the chaos.
              Connect all your communication channels, easily grant user rights, and receive helpful reporting.
              Have everything under control  and your customers under your spell. Discover the TicketFlow ticketing system now!'
            image={desktopTeam}
            reverse={true}
        />

        <FeatureSession/>

    </div>
  )
}

export default LandingPage