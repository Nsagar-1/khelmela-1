import { Link } from "wouter";
import { Trophy } from "lucide-react";
import { 
  FaDiscord, 
  FaTwitter, 
  FaInstagram, 
  FaYoutube, 
  FaTwitch 
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-dark">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Link href="/">
              <a className="flex items-center gap-2 mb-6">
                <div className="bg-primary p-2 rounded-lg">
                  <Trophy className="text-light" />
                </div>
                <h1 className="text-2xl font-bold font-orbitron tracking-wider">
                  <span className="text-primary">Khel</span>
                  <span className="text-secondary">Mela</span>
                </h1>
              </a>
            </Link>
            <p className="text-gray-400 mb-6">
              The ultimate esports tournament platform for gamers of all levels. Create, join, and compete in tournaments designed for the gaming community.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-secondary transition-colors text-xl">
                <FaDiscord />
              </a>
              <a href="#" className="text-gray-400 hover:text-secondary transition-colors text-xl">
                <FaTwitter />
              </a>
              <a href="#" className="text-gray-400 hover:text-secondary transition-colors text-xl">
                <FaInstagram />
              </a>
              <a href="#" className="text-gray-400 hover:text-secondary transition-colors text-xl">
                <FaYoutube />
              </a>
              <a href="#" className="text-gray-400 hover:text-secondary transition-colors text-xl">
                <FaTwitch />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold font-rajdhani text-white mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/">
                  <a className="text-gray-400 hover:text-secondary transition-colors">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/tournaments">
                  <a className="text-gray-400 hover:text-secondary transition-colors">Tournaments</a>
                </Link>
              </li>
              <li>
                <Link href="/#features">
                  <a className="text-gray-400 hover:text-secondary transition-colors">Features</a>
                </Link>
              </li>
              <li>
                <Link href="/#download">
                  <a className="text-gray-400 hover:text-secondary transition-colors">Download</a>
                </Link>
              </li>
              <li>
                <Link href="/#about">
                  <a className="text-gray-400 hover:text-secondary transition-colors">About Us</a>
                </Link>
              </li>
              <li>
                <Link href="/#contact">
                  <a className="text-gray-400 hover:text-secondary transition-colors">Contact</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold font-rajdhani text-white mb-6">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-secondary transition-colors">Support Center</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-secondary transition-colors">Tournament Rules</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-secondary transition-colors">API Documentation</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-secondary transition-colors">Game Integrations</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-secondary transition-colors">Developer Resources</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-secondary transition-colors">FAQ</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold font-rajdhani text-white mb-6">Legal</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-secondary transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-secondary transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-secondary transition-colors">Cookie Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-secondary transition-colors">GDPR Compliance</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-secondary transition-colors">Content Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-secondary transition-colors">Refund Policy</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
           2025 KhelMela. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="h-6 opacity-50 hover:opacity-100 transition-opacity">
              <svg width="40" height="15" viewBox="0 0 1000 323" fill="currentColor" className="text-gray-400">
                <path d="M433.4,177.7h-75.6v-144H300v322.6h57.8v-133h75.6v133h57.8V33.7h-57.8V177.7z M614.5,177.7l-46.7-144h-62.9l75.7,214 c-6.5,19.4-13,28.3-34,28.3v45.9c53.6,3.2,71.1-23.5,86.6-71.8l72.7-216.4h-59.3L614.5,177.7z M180.8,258.1 c-15.5,0-27.4-2.6-37.4-7.9l-0.1-62.7c8.7,7.3,20.6,13.5,35.9,13.5c26.3,0,44.3-20.6,44.3-47.6c0-27.5-17.6-47.3-43.8-47.3 c-33.1,0-53.9,26.3-53.9,70.9c0,60.2,29.2,88.9,76.8,88.9c20.6,0,40.7-3.5,52.2-8.8v-43.5C240.6,251.2,209.7,258.1,180.8,258.1z M178.7,143.9c9.1,0,15.3,8.2,15.3,19.9c0,11.7-5.9,19.9-15.3,19.9c-4.3,0-8.5-1.4-11.5-3.6v-32.8C170.4,145,174.3,143.9,178.7,143.9z"/>
              </svg>
            </div>
            <div className="h-6 opacity-50 hover:opacity-100 transition-opacity">
              <svg width="40" height="15" viewBox="0 0 512 512" fill="currentColor" className="text-gray-400">
                <path d="M256,0C114.8,0,0,114.8,0,256s114.8,256,256,256s256-114.8,256-256S397.2,0,256,0z M287.9,384H255.5c0,0-0.4,0-1.2,0c-19.9,0-36.7-6.4-48-16.6c-8.5-7.7-17.2-23.2-17.2-23.2l-41.3,10.8c0,0,8.3,22.1,16.1,31.6c16.9,20.6,47.2,33.1,91.5,33.1h1.2h30.6V384z M200.2,171.7c0,0,66.7-22,66.7-80.9c0-43.7-41.6-59.1-41.6-59.1s-53.8,8.2-53.8,63.3C171.5,170.7,200.2,171.7,200.2,171.7z M219.8,211.7c0,0-82.6,2.2-82.6,88.3c0,92.8,93.1,86,93.1,86s30.2-1.7,53.9-20.8c-12.1-16.2-19.7-38.1-19.7-38.1s-35.2,30.3-68.4,0c-33.8-30.9,0-83.7,0-83.7s15-32.2,62.4-31.7C258.5,211.6,249.2,222.1,219.8,211.7z M323.5,308.4h82.2v-31.7H323.5V308.4z M323.5,236.2h82.2v-31.7H323.5V236.2z"/>
              </svg>
            </div>
            <div className="h-6 opacity-50 hover:opacity-100 transition-opacity">
              <svg width="60" height="15" viewBox="0 0 1000 279" fill="currentColor" className="text-gray-400">
                <path d="M192.1,196.6c-6.9,0-12.7-5.3-12.7-12.7c0-7.4,5.3-12.7,12.7-12.7h175c6.9,0,12.7,5.3,12.7,12.7c0,7.4-5.3,12.7-12.7,12.7H192.1z M183.5,139c0-7.4,5.8-13.2,13.2-13.2h175c7.4,0,12.7,5.8,12.7,13.2c0,7.4-5.3,12.7-12.7,12.7h-175C189.3,151.7,183.5,146.4,183.5,139z M192.1,107.4c-6.9,0-12.7-5.3-12.7-12.7c0-7.4,5.3-13.2,12.7-13.2h175c6.9,0,12.7,5.8,12.7,13.2c0,7.4-5.3,12.7-12.7,12.7H192.1z M906.7,105.8c16.9,0,30-5.3,40.1-16.4c10.1-11.1,14.8-23.8,14.8-39.6c0-16.4-4.8-29-14.8-40.1C936.7,98.4,923.1,93.7,906.7,93.7C888.7,93.7,875,98.9,864.9,110C775.9,121.1,758.9,133.8,758.9,150.7c0,16.4,4.8,29,14.8,40.1c10.1,10.6,23.8,16.4,40.6,16.4c12.7,0,23.8-2.6,32.7-8.5c6.9-4.2,14.3-12.2,23.2-22.7l-15.3-12.2c-13.8,16.9-25.3,25.3-35.9,25.3c-8.5,0-15.9-2.6-21.1-8.5c-5.3-5.8-7.9-12.7-7.9-22.2h124.5v-9C914.6,129.1,912.5,115.9,906.7,105.8z M789.2,129.1c1.1-8.5,4.2-15.9,9-21.1c5.3-5.3,11.6-7.9,20.1-7.9c7.9,0,14.3,2.6,19.6,7.9c5.3,5.3,7.9,12.7,7.9,21.1H789.2z M590.6,196.6h26.9V105.3h40.1V83.1h-40.1V67.8c0-8.5,1.6-14.3,4.8-17.5c3.2-3.2,9-4.8,17.5-4.8h17.5V24.1h-29c-14.8,0-26.4,4.2-34.9,13.2c-8.5,8.5-12.7,20.6-12.7,36.4v9.5h-23.8v22.2h23.8v91.2H590.6z M664.7,196.6h26.9V0h-26.9V196.6z M453.1,129.1c0-28.5,11.6-43.3,34.3-43.3c5.8,0,11.6,1.1,17.5,3.2c5.8,2.1,10.1,5.3,13.2,8.5l11.6-22.2c-11.6-9.5-25.9-13.8-43.8-13.8c-17.5,0-32.2,6.4-43.3,18.5c-11.1,12.2-16.9,28.5-16.9,49.1c0,21.7,5.8,39.1,16.9,51.2c11.1,12.2,25.9,18.5,43.8,18.5c17.5,0,32.2-5.3,43.8-15.9l-11.6-21.7c-3.2,3.7-7.9,6.9-13.8,9c-5.8,2.1-11.6,3.2-17.5,3.2C464.7,173.5,453.1,158.1,453.1,129.1z M358,83.1c-15.9,0-27.4,5.8-34.9,17v-15.9h-25.9v112.3h26.9v-57.5c0-10.1,2.6-18,7.9-23.2c5.3-5.3,12.7-7.9,22.2-7.9c7.9,0,14.3,2.1,18.5,6.4c4.2,4.2,6.4,11.1,6.4,20.6v61.7h26.9v-69.6c0-30.1-16-43.8-47.9-43.8H358z M72.4,27.3v138.2c0,9,2.6,15.9,8.5,21.1c5.8,5.3,13.2,7.9,22.2,7.9h33.8v-21.7H123c-9.5,0-14.3-4.8-14.3-14.3v-69h29v-20.6h-29V27.3H72.4z"/>
              </svg>
            </div>
            <div className="h-6 opacity-50 hover:opacity-100 transition-opacity">
              <svg width="40" height="15" viewBox="0 0 512 512" fill="currentColor" className="text-gray-400">
                <path d="M0,99v314h512V99H0z M490,137l-234,151L22,137H490z M26,137.3l173,114.4l-173,128V137.3z M38,391l176.3-130.2l31.7,20.8c4.2,2.8,9,4.2,13.9,4.2s9.7-1.4,13.9-4.2l31.7-20.8L482,391H38z M486,379.7l-173-128l173-114.4V379.7z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
