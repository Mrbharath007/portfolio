import React, { useState } from 'react';
import { TbMessageChatbotFilled } from "react-icons/tb";
import { MdEmail, MdCall, MdErrorOutline } from "react-icons/md";
import { FaWhatsapp, FaInstagram, FaLinkedinIn, FaGithub, FaCopy, FaCheck } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import Interactive3DScene from './Interactive3DScene';
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Contact.css';

const Contact = ({ mainColor = "#7b61ff" }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    message: false
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('bharathdws98424@gmail.com');
    setCopied(true);
    toast.info("Email address copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  // Validation rules
  const validateField = (name, value) => {
    const trimmed = value ? value.trim() : '';

    switch (name) {
      case 'name':
        if (!trimmed) {
          return 'Name is required.';
        }
        // Name should only contain letters, spaces, hyphens, and apostrophes
        if (!/^[a-zA-Z\s'-]+$/.test(trimmed)) {
          return 'Name must contain letters and spaces only (no numbers or special characters).';
        }
        if (trimmed.length < 2) {
          return 'Name must be at least 2 characters long.';
        }
        return '';

      case 'email':
        if (!trimmed) {
          return 'Email address is required.';
        }
        // Standard RFC 5322 compliant regex for email formatting
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(trimmed)) {
          return 'Please enter a valid email address (e.g. name@domain.com).';
        }
        return '';

      case 'message':
        if (!trimmed) {
          return 'Message is required.';
        }
        if (trimmed.length < 5) {
          return 'Message must be at least 5 characters.';
        }
        return '';

      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // If field was already touched, validate dynamically as user types
    if (touched[name]) {
      const errorMsg = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: errorMsg
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true
    }));

    const errorMsg = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: errorMsg
    }));
  };

  const validateAll = () => {
    const newErrors = {
      name: validateField('name', formData.name),
      email: validateField('email', formData.email),
      message: validateField('message', formData.message)
    };

    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      message: true
    });

    return !newErrors.name && !newErrors.email && !newErrors.message;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateAll();
    if (!isValid) {
      toast.error("Please correct the errors in the form before submitting.");
      return;
    }

    setIsLoading(true);
    let isSavedToDb = false;
    let isEmailSent = false;
    
    // 1. Save to Firebase Firestore database
    try {
      await addDoc(collection(db, 'contacts'), {
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
        createdAt: Timestamp.now()
      });
      isSavedToDb = true;
    } catch (firestoreError) {
      console.warn("Firestore submission note:", firestoreError);
    }

    // 2. Send structured email directly to bharathdws98424@gmail.com
    try {
      const response = await fetch("https://formsubmit.co/ajax/bharathdws98424@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          _subject: `📬 New Portfolio Message from ${formData.name.trim()}`,
          "Sender Name": formData.name.trim(),
          "Sender Email": formData.email.trim(),
          "Message": formData.message.trim(),
          "Submitted At": new Date().toLocaleString(),
          _replyto: formData.email.trim(),
          _template: "table",
          _captcha: "false"
        })
      });

      if (response.ok) {
        isEmailSent = true;
      }
    } catch (emailError) {
      console.warn("Email delivery note:", emailError);
    }

    setIsLoading(false);

    // If at least one channel succeeded (e.g. safely recorded in DB or delivered)
    if (isSavedToDb || isEmailSent) {
      toast.success("Thank you! Your message has been sent successfully.");
      setFormData({ name: '', email: '', message: '' });
      setErrors({ name: '', email: '', message: '' });
      setTouched({ name: false, email: false, message: false });
    } else {
      toast.error(
        "Unable to send message at the moment. Please reach out directly at bharathdws98424@gmail.com"
      );
    }
  };

  return (
    <div className="contact-page" id="contact">
      <div className="contact-container">
        {/* Left Side: Contact Info */}
        <div className="contact-info-container">
          <h2 className="contact-heading">Contact Me</h2>

          {/* Interactive 3D Beacon Satellite */}
          <div style={{ width: "100%", maxWidth: "220px", margin: "0 auto 10px auto" }}>
            <Interactive3DScene mode="beacon-satellite" mainColor={mainColor} height="130px" />
          </div>

          <div className="contact-details">
            <div className="contact-detail">
              <MdEmail className="contact-detail-icon" />
              <span className="contact-detail-text">
                <a href="mailto:bharathdws98424@gmail.com" className="contact-link">
                  bharathdws98424@gmail.com
                </a>
              </span>
              <button
                type="button"
                className="copy-email-btn"
                onClick={handleCopyEmail}
                title="Copy Email"
                aria-label="Copy Email"
              >
                {copied ? <FaCheck className="copied-icon" /> : <FaCopy />}
              </button>
            </div>
            <div className="contact-detail">
              <MdCall className="contact-detail-icon" />
              <span className="contact-detail-text">
                <a href="tel:+917904117676" className="contact-link">
                  +91 7904117676
                </a>
              </span>
            </div>
          </div>

          <p className="contact-message">
            Please feel free to reach out regarding any inquiries, collaborations, or consultations.
            I look forward to connecting with you.
          </p>

          <div className="follow-me-containers">
            <p className="follow-texts">Follow me on :</p>
            <div className="contact-social-icons">
              <a href="https://wa.me/7904117676" target="_blank" rel="noopener noreferrer" className="contact-social-link">
                <FaWhatsapp className="contact-social-icon" />
              </a>
              <a href="https://www.instagram.com/mr_bharath___07?igsh=M3ZlcHBqM2dmYnly" target="_blank" rel="noopener noreferrer" className="contact-social-link">
                <FaInstagram className="contact-social-icon" />
              </a>
              <a href="https://www.linkedin.com/in/bharath-b-ai?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="contact-social-link">
                <FaLinkedinIn className="contact-social-icon" />
              </a>
              <a href="https://github.com/Mrbharath007" target="_blank" rel="noopener noreferrer" className="contact-social-link">
                <FaGithub className="contact-social-icon" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div className="contact-form-container">
          <h2 className="form-heading">Get in Touch</h2>
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            {/* Name Input */}
            <div className={`input-container ${touched.name && errors.name ? 'has-error' : ''}`}>
              <input
                type="text"
                name="name"
                id="name"
                required
                className={`contact-input ${touched.name && errors.name ? 'input-error' : ''}`}
                placeholder=" "
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={touched.name && !!errors.name}
                aria-describedby={touched.name && errors.name ? "name-error" : undefined}
              />
              <label htmlFor="name" className="floating-label">Your Name</label>
              {touched.name && errors.name && (
                <div className="input-error-msg" id="name-error">
                  <MdErrorOutline className="input-error-icon" />
                  <span>{errors.name}</span>
                </div>
              )}
            </div>

            {/* Email Input */}
            <div className={`input-container ${touched.email && errors.email ? 'has-error' : ''}`}>
              <input
                type="email"
                name="email"
                id="email"
                required
                className={`contact-input ${touched.email && errors.email ? 'input-error' : ''}`}
                placeholder=" "
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={touched.email && !!errors.email}
                aria-describedby={touched.email && errors.email ? "email-error" : undefined}
              />
              <label htmlFor="email" className="floating-label">Your Email</label>
              {touched.email && errors.email && (
                <div className="input-error-msg" id="email-error">
                  <MdErrorOutline className="input-error-icon" />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Message Textarea */}
            <div className={`input-container ${touched.message && errors.message ? 'has-error' : ''}`}>
              <textarea
                name="message"
                id="message"
                required
                className={`contact-input ${touched.message && errors.message ? 'input-error' : ''}`}
                placeholder=" "
                value={formData.message}
                onChange={handleChange}
                onBlur={handleBlur}
                rows="6"
                aria-invalid={touched.message && !!errors.message}
                aria-describedby={touched.message && errors.message ? "message-error" : undefined}
              />
              <label htmlFor="message" className="floating-label">Your Message</label>
              {touched.message && errors.message && (
                <div className="input-error-msg" id="message-error">
                  <MdErrorOutline className="input-error-icon" />
                  <span>{errors.message}</span>
                </div>
              )}
            </div>

            <button 
              type="submit" 
              className="contact-submit" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span> Sending...
                </>
              ) : (
                'Send Message'
              )}
            </button>
          </form>
        </div>
      </div>
      <ToastContainer position="bottom-right" theme="dark" autoClose={4000} />
    </div>
  );
};

export default Contact;
