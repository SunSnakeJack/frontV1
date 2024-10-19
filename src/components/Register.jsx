import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import '../assets/css/styles.css';
import Logo from '../assets/images/logo.jpg';

function Register() {
    const navigate = useNavigate();
    const MySwal = withReactContent(Swal);
    const [isActive, setIsActive] = useState(false); // จัดการสถานะของเมนู

    const handleToggle = () => {
        setIsActive(!isActive); // สลับสถานะเมื่อกดปุ่มเมนู
    };
    const [inputs, setInputs] = useState({
        fname: '',
        lname: '',
        email: '',
        password: '',
        phoneNumber: ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }));
    };

    async function checkEmailExists(email) {
        try {
            const response = await fetch('http://localhost:3333/checkEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return data.exists;
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            return false;
        }
    }

    async function checkPhoneNumberExists(phoneNumber) {
        try {
            const response = await fetch('http://localhost:3333/checkphoneNumber', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ phoneNumber: phoneNumber })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return data.exists;
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            return false;
        }
    }

    const validate = () => {
        let errors = {};
        const emailPattern = /^[A-Za-z][A-Za-z0-9.-_+-]*@(gmail\.com|hotmail\.com)$/; // อีเมลต้องอยู่ในโดเมน gmail หรือ hotmail
        const specialCharsPattern = /[^a-zA-Z]/g;
        const specialCharsPatternForPassword = /[!@#$%^&*(),.?":{}|<>~`/[\];'_+=-]/g;
        const phoneNumberPattern = /^0[689]\d{8}$/;

        // Firstname 
        if (!inputs.fname) {
            errors.fname = "Firstname is required.";
        } else if (inputs.fname.length < 8 || inputs.fname.length > 18) {
            errors.fname = "Firstname must be between 8 and 18 characters.";
        }
        else if (/\d/.test(inputs.fname)) {
            errors.fname = "Firstname cannot contain numbers.";
        } else if (specialCharsPattern.test(inputs.fname)) {
            errors.fname = "Firstname cannot contain special characters.";
        }


        //Lastname
        if (!inputs.lname) {
            errors.lname = "Lastname is required.";
        } else if (inputs.lname.length < 8 || inputs.lname.length > 18) {
            errors.lname = "Lastname must be between 8 and 18 characters.";
        }
        else if (/\d/.test(inputs.lname)) {
            errors.lname = "Lastname cannot contain numbers.";
        } else if (specialCharsPattern.test(inputs.lname)) {
            errors.lname = "Lastname cannot contain special characters.";
        }


        //Email
        if (!inputs.email) {
            errors.email = "Email is required.";
        } else if (!emailPattern.test(inputs.email)) {
            errors.email = "Invalid email format.";
        } else if (inputs.email.length < 8 || inputs.email.length > 256) {
            errors.email = "Email must be between 8 and 256 characters.";
        }

        if (!inputs.phoneNumber) {
            errors.phoneNumber = "Phone number is required.";
        } else if (!phoneNumberPattern.test(inputs.phoneNumber)) {
            errors.phoneNumber = "Invalid phoneNumber format."
        }
        else if (inputs.phoneNumber.length < 10 || inputs.phoneNumber.length > 10) {
            errors.phoneNumber = "Phone number must be 10 digits.";
        }

        //Password
        if (!inputs.password) {
            errors.password = "Password is required.";
        } else if (inputs.password.length < 8 || inputs.password.length > 64) {
            errors.password = "Password must be between 8 and 64 characters.";
        } else if (!/[A-Z]/.test(inputs.password)) {
            errors.password = "Password must contain at least one uppercase letter.";
        } else if (!/[a-z]/.test(inputs.password)) {
            errors.password = "Password must contain at least one lowercase letter.";
        } else if (!/\d/.test(inputs.password)) {
            errors.password = "Password must contain at least one number.";
        } else if (!specialCharsPatternForPassword.test(inputs.password)) {
            errors.password = "Password must contain at least one special character.";
        }

        console.log("Password validation errors:", errors.password);
        return errors;

    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const emailExists = await checkEmailExists(inputs.email);
        if (emailExists) {
            setErrors(prevErrors => ({ ...prevErrors, email: "This email is already registered." }));
            return;
        }

        const phoneNumberExists = await checkPhoneNumberExists(inputs.phoneNumber);
        if (phoneNumberExists) {
            setErrors(prevErrors => ({ ...prevErrors, phoneNumber: "This phone number is already registered." }));
            return;
        }

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "fname": inputs.fname,
            "lname": inputs.lname,
            "email": inputs.email,
            "password": inputs.password,
            "phoneNumber": inputs.phoneNumber
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch("http://localhost:3333/register", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if (result.status === 'ok') {
                    MySwal.fire({
                        imageUrl: Logo,
                        imageWidth: 100,
                        imageHeight: 100,
                        title: 'Register Success',
                        icon: 'success',
                        confirmButtonText: 'Login'
                    }).then(() => {
                        navigate('/login');
                    });
                } else {
                    MySwal.fire({
                        html: <i>{result.message}</i>,
                        icon: 'error'
                    });
                }
            })
            .catch((error) => console.error(error));
    }

    return (
        <>
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

            <div className={`HamMenu ${isActive ? 'change' : ''}`} onClick={handleToggle}>
                <div className="bar1"></div>
                <div className="bar2"></div>
                <div className="bar3"></div>
            </div>
            <div id="MyMenu" className={`menu ${isActive ? 'menu-active' : ''}`}>
                <ul className="navMenu">
                    <li><Link to="/" className="active">Home</Link></li>
                    <li><Link to="/SearchRoom1">Search Room</Link></li>
                    <li><Link to="/Contact1">Contact Us</Link></li>
                    <li><Link to="/login"><i className="fa fa-calendar"></i><span>Book Now</span></Link></li>
                </ul>
            </div>

            <div className="form-container">
                <form onSubmit={handleSubmit} className="register-form">
                    <h2>Register</h2>
                    <label>First name:
                        <input
                            type="text"
                            name="fname"
                            value={inputs.fname || ""}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </label>
                    {errors.fname && <p style={{ color: 'red' }}>{errors.fname}</p>}
                    <br />
                    <label>Last name:
                        <input
                            type="text"
                            name="lname"
                            value={inputs.lname || ""}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </label>
                    {errors.lname && <p style={{ color: 'red' }}>{errors.lname}</p>}
                    <br />
                    <label>Email:
                        <input
                            type="text"
                            name="email"
                            value={inputs.email || ""}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </label>
                    {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
                    <br />
                    <label>Password:
                        <input
                            type="password"
                            name="password"
                            value={inputs.password || ""}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </label>
                    {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
                    <br />
                    <label>phoneNumber:
                        <input
                            type="number"
                            name="phoneNumber"
                            value={inputs.phoneNumber || ""}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </label>
                    {errors.phoneNumber && <p style={{ color: 'red' }}>{errors.phoneNumber}</p>}
                    <br />
                    <input type="submit" className="form-submit" value="Register" />
                </form>
            </div>

            <footer>
                <div className="container">
                    <div className="col-lg-8">
                        <p>© 2018 www.baraliresort.com. All rights reserved. </p>
                    </div>
                </div>
            </footer>
        </>
    );
}

export default Register;