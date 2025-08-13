import React from 'react'
import { Link } from 'react-router-dom';
import fileIcon from '../assets/file.svg';
import doubleArrowIcon from '../assets/doublearrow.svg';

const Explore = () => {
  return (
    <div className="p-4 max-w-sm space-y-4">
      <Link to="/exam-vault" className="flex items-center justify-between w-full bg-gradient-to-r from-red-500 to-orange-400 text-white font-semibold px-2 py-3 rounded-lg hover:opacity-80">
        <div className="flex items-center space-x-2">
          <img src={fileIcon} alt="PYQ Icon" className="h-8 w-8" />
          <span>Explore PYQs</span>
        </div>
        <span className="text-xl"><img src={doubleArrowIcon} alt="Arrow" className="h-8 w-8" />
        </span> {/* Double right arrow » */}
      </Link>

      <p className="text-gray-600 text-sm leading-relaxed">
        Lorem ipsum dolor sit amet consectetur. Nec porta nibh pulvinar a purus
        potenti sed vestibulum at. Semper diam adipiscing diam risus sit eu amet
        lorem morbi. Pulvinar tellus urna.
      </p>

      <div className="border-t border-gray-300 mt-2"></div>
    </div>
  );
};

export default Explore;
