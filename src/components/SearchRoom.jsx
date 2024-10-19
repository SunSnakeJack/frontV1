import React, { useState, useEffect } from 'react';
import '../assets/css/fontawesome.css';
import '../assets/css/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'swiper/swiper-bundle.css';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/images/logo.jpg'
import { Avatar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import '../assets/css/Sidebar.css'
import Sidebar from './sidebar'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import HotelIcon from '@mui/icons-material/Hotel'
import BedIcon from '@mui/icons-material/Bed'
import 'bootstrap/dist/css/bootstrap.min.css';

import { Dropdown, DropdownButton } from 'react-bootstrap';

const SearchRoom = () => {
  const [filter, setFilter] = useState('*');
  const [searchTerm, setSearchTerm] = useState('');
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const [isLoaded, setIsLoaded] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token') !== null);
  const [filterQuantity, setFilterQuantity] = useState('*');
  const [rooms, setRooms] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const handleFilterChange = (filterType) => {
    setFilter(filterType);
  };

  const handleFilterChangePrice = (range) => {
    setSearchTerm(range);
  };

  const handleFilterChangeQuantity = (range) => {
    setFilterQuantity(range); // เก็บค่าฟิลเตอร์ quantity ที่เลือก
  };
  
  const getQuantityMinMax = (range) => {
    const [min, max] = range.split('-').map(Number);
    return { min: min || 0, max: max || Infinity };
  };
  
  const handleSearch = (e) => {
    const value = e.target.value.trim(); // ตรวจสอบถ้ามีการกรอกข้อมูล
    if (value === '') {
      setSearchTerm('');
    } else {
      const maxPrice = parseInt(value, 10); // แปลงเป็นจำนวนเต็ม
      if (!isNaN(maxPrice)) {
        setSearchTerm(`${1}-${maxPrice}`); // กำหนดช่วงราคาเป็น 1 ถึง maxPrice
      }
    }
  };

  const getMinMax = (range) => {
    const [min, max] = range.split('-').map(Number);
    return { min: min || 0, max: max || Infinity };
  };

  const handleRoomDetails = (roomId) => {
    navigate(`/RoomDetails/${roomId}`);
  };


  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + token);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };

      try {
        // Fetch profile data
        const profileResponse = await fetch("http://localhost:3333/profile", requestOptions);
        const profileResult = await profileResponse.json();
        if (profileResult.status === 'ok') {
          setUser(profileResult.user);
        } else if (profileResult.status === 'forbidden') {
          await MySwal.fire({
            html: <i>{profileResult.message}</i>,
            icon: 'error'
          });
          navigate('/');
          return; // Exit early if forbidden
        }

        // Fetch booking details
        const roomResponse = await fetch("http://localhost:3333/rooms", requestOptions);
        const roomResult = await roomResponse.json();
        if (roomResult.status === 'ok') {
          setRooms(roomResult.rooms);
        } else if (roomResult.status === 'forbidden') {
          await MySwal.fire({
            html: <i>{roomResult.message}</i>,
            icon: 'error'
          });
          navigate('/');
          return; // Exit early if forbidden
        }

        setIsLoaded(true); // Set loaded state to true when both requests are done
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error as needed
      }
    };

    fetchData();
  }, [MySwal, navigate]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
  return (
    <div>

      <div className="sub-header">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-md-8">
              <ul className="info">
                <li><i className="fa fa-envelope"></i> rsvn@baraliresort.com</li>
                <li><i className="fa fa-map"></i> Barali Beach Resort 10240</li>
              </ul>
            </div>
            <div className="col-lg-4 col-md-4">
              <ul className="social-links">
                <li><Link to="https://www.facebook.com/baraliresort/?locale=th_TH"><i className="fab fa-facebook"></i></Link></li>
                <li><Link to="https://www.instagram.com/barali_beach_resort/"><i className="fab fa-instagram"></i></Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <header className="header-area header-sticky">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <nav className="main-nav">
                <Link to="/" className="logo">
                  <img src={Logo} alt="" />
                </Link>

                <ul className="nav">
                  <li><Link to="/Profile" className="active">Home</Link></li>
                  <li><Link to="/SearchRoom">Search Room</Link></li>
                  <li><Link to="/Contact">Contact Us</Link></li>
                  <li><Link to="/SearchRoom"><i className="fa fa-calendar"></i><span>Book Now</span></Link></li>
                  {isLoggedIn ? (
                    <li>
                      <Avatar
                        src={user.image ? `data:image/jpeg;base64,${user.image}` : 'default-image-url'}
                        alt={user.id}
                        onClick={handleSidebarToggle}
                      />
                    </li>
                  ) : (
                    <li>
                      <button onClick={handleSidebarToggle}>Login</button>
                    </li>
                  )}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleSidebarToggle}
        isLoggedIn={isLoggedIn}
        handleLogout={handleLogout}
      />

      <div className="page-heading header-text">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h3>Search Room</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="section properties">
        <div className="container">
          {/* Input ค้นหา */}
          <input
            type="text"
            placeholder='Search'
            onChange={handleSearch}
            className="Search"
          />

          <DropdownButton id="dropdown-filter" title="Filter by Room Type">
            <Dropdown.Item onClick={() => handleFilterChange('*')}>Show All</Dropdown.Item>
            <Dropdown.Item onClick={() => handleFilterChange('single room')}>Single Room</Dropdown.Item>
            <Dropdown.Item onClick={() => handleFilterChange('double room')}>Double Room</Dropdown.Item>
          </DropdownButton>

          <DropdownButton id="dropdown-filter-price" title="Filter by Price">
            <Dropdown.Item onClick={() => handleFilterChangePrice('*')}>Show All</Dropdown.Item>
            <Dropdown.Item onClick={() => handleFilterChangePrice('0-2000')}>Less than 2,000</Dropdown.Item>
            <Dropdown.Item onClick={() => handleFilterChangePrice('2000-4000')}>2,000 - 4,000</Dropdown.Item>
            <Dropdown.Item onClick={() => handleFilterChangePrice('4000-6000')}>4,000 - 6,000</Dropdown.Item>
            <Dropdown.Item onClick={() => handleFilterChangePrice('6000-10000')}>More than 6,000</Dropdown.Item>
          </DropdownButton>

          <DropdownButton id="dropdown-filter-quantity" title="Filter by Quantity">
  <Dropdown.Item onClick={() => handleFilterChangeQuantity('*')}>Show All</Dropdown.Item>
  <Dropdown.Item onClick={() => handleFilterChangeQuantity('1-2')}>1 - 2</Dropdown.Item>
  <Dropdown.Item onClick={() => handleFilterChangeQuantity('3-4')}>3 - 4</Dropdown.Item>
  <Dropdown.Item onClick={() => handleFilterChangeQuantity('5-10')}>More than 4</Dropdown.Item>
</DropdownButton>



          <div className="row properties-box">
            {rooms
              // .filter(room => {
              //   const roomPrice = parseInt(room.roomPrice.replace(/,/g, '')); // เอา ',' ออกจากราคา
              //   const roomQuantity = parseInt(room.roomArea);
              //   const { min: priceMin, max: priceMax } = getMinMax(searchTerm);
              //   const { min: quantityMin, max: quantityMax } = getQuantityMinMax(filterQuantity);
              
              //   return (filter === '*' || room.type === filter) &&
              //     (roomPrice >= priceMin && roomPrice <= priceMax) &&
              //     (roomQuantity >= quantityMin && roomQuantity <= quantityMax);
              // })
              
              .map(room => (
                <div key={room.roomId} className={`col-lg-4 col-md-6 align-self-center mb-30 properties-items ${room.roomType}`}>
                  <div className="item">
                    <Link to={`/RoomDetails1/${room.roomId}`} onClick={() => handleRoomDetails(room.roomId)}>
                    <img src={`data:image/jpeg;base64,${room.roomImage}`} alt={room.roomName} />
                    </Link>
                    <span className="category">
                      {room.roomType === 'single room' ? <HotelIcon style={{ fontSize: 30 }}></HotelIcon> : <BedIcon style={{ fontSize: 30 }}></BedIcon>}
                    </span>
                    <h6>THB {room.roomPrice}</h6>
                    <h4><Link to={`/RoomDetails1/${room.roomId}`} onClick={() => handleRoomDetails(room.roomId)}>{room.roomName}</Link></h4>
                    <ul>
                      <li>Quantity: <span>{room.roomArea}</span></li>
                      <li>Stay 2 Nights Extra Save 5%</li>
                    </ul>
                    <div className="main-button">
                      <Link to={`/RoomDetails1/${room.roomId}`} onClick={() => handleRoomDetails(room.roomId)}>Room Details</Link>
                    </div>
                  </div>
                </div>
              ))}
          </div>

        </div>
      </div>

      <footer>
        <div className="container">
          <div className="col-lg-12">
            <p>© 2018 www.baraliresort.com. All rights reserved. </p>
          </div>
        </div>
      </footer>
    </div>
  );}
};

export default SearchRoom;