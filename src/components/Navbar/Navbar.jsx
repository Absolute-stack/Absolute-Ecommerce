import "./Navbar.css";
import bag_icon from "../../assets/images/bag.svg";
import { useState, useEffect, useRef } from "react";
import heart_icon from "../../assets/images/love.svg";
import hanger_icon from "../../assets/images/hanger.svg";
import profile_icon from "../../assets/images/Profile.svg";

export default function Navbar({ filters = {}, onChange }) {
  const [searchInput, setSearchInput] = useState(filters.search || "");
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      onChange({ ...filters, search: searchInput || undefined });
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    if (!filters.search) {
      setSearchInput("");
    }
  }, [filters.search]);

  return (
    <nav className="nav">
      <div className="container">
        <div className="nav-left">
          <div className="logo-container">
            <img
              src={hanger_icon}
              alt={hanger_icon}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
            <h2>Fashion Hub</h2>
          </div>
          <div className="links-containers">
            <ul className="ul-link-container">
              <li>Men</li>
              <li>Women</li>
              <li>Accessories</li>
              <li>Sale</li>
            </ul>
          </div>
        </div>
        <div className="nav-right">
          <div className="searchbar-container">
            <input
              type="text"
              placeholder="Search items..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <div className="icons-container">
            <img
              src={heart_icon}
              alt={heart_icon}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
            <div className="bag-container">
              <img
                src={bag_icon}
                alt={bag_icon}
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
              <div className="bag-number">3</div>
            </div>
            <img
              src={profile_icon}
              alt={profile_icon}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
