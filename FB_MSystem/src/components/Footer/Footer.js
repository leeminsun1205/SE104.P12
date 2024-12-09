import React from 'react';
import styles from './Footer.module.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.info}>
          <p>&copy; {currentYear} Football Championship Management. All rights reserved.</p>
        </div>
        <div className={styles.socialLinks}>
          {socialMediaLinks.map(({ href, icon, name }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit our ${name}`}
            >
              <i className={`fab ${icon}`}></i>
            </a>
          ))}
        </div>
        <div className={styles.links}>
          {footerLinks.map(({ href, label }) => (
            <a key={label} href={href}>
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

const socialMediaLinks = [
  { href: 'https://facebook.com', icon: 'fa-facebook-f', name: 'Facebook' },
  { href: 'https://twitter.com', icon: 'fa-twitter', name: 'Twitter' },
  { href: 'https://instagram.com', icon: 'fa-instagram', name: 'Instagram' },
];

const footerLinks = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/contact', label: 'Contact Us' },
];

export default Footer;
