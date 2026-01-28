import { CreditCard } from 'lucide-react';
import type { SVGProps } from 'react';

const Logo = (props: SVGProps<SVGSVGElement>) => (
  <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
    <CreditCard className="w-6 h-6 text-primary" />
  </div>
);

const Visa = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="32"
    viewBox="0 0 38 24"
    role="img"
    aria-labelledby="pi-visa"
    {...props}
  >
    <title id="pi-visa">Visa</title>
    <g fill="none">
      <path
        fill="#2965C8"
        d="M35,22.132C35,23.168,34.168,24,33.132,24H4.868C3.832,24,3,23.168,3,22.132V1.868C3,0.832,3.832,0,4.868,0H33.13C34.168,0,35,0.83,35,1.868V22.132Z"
      />
      <path
        fill="#FFFFFF"
        d="M11.378,16.516 L7.524,7.484 L11.378,7.484 L11.378,7.484 L13.684,13.192 L14.072,14.596 L14.46,13.192 L16.766,7.484 L20.62,7.484 L16.766,16.516 L11.378,16.516 Z M23.232,7.484 L20.106,16.516 L23.232,16.516 L23.232,16.516 L26.358,7.484 L23.232,7.484 Z M30.852,7.484 L27.6,7.484 L28.9,12.3 L29.288,10.66 L29.288,10.66 L27.28,7.74 L25.174,16.516 L28.52,16.516 L33.91,7.484 L30.852,7.484 Z"
      />
    </g>
  </svg>
);

const Mastercard = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="32"
    viewBox="0 0 38 24"
    role="img"
    aria-labelledby="pi-mastercard"
    {...props}
  >
    <title id="pi-mastercard">Mastercard</title>
    <g fill="none">
      <circle fill="#EB001B" cx="15" cy="12" r="7" />
      <circle fill="#F79E1B" cx="23" cy="12" r="7" />
      <path
        fill="#FF5F00"
        d="M22,12 C22,15.866 18.866,19 15,19 C11.134,19 8,15.866 8,12 C8,8.134 11.134,5 15,5 C18.866,5 22,8.134 22,12 Z"
      />
    </g>
  </svg>
);

const Amex = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="32"
    viewBox="0 0 38 24"
    role="img"
    aria-labelledby="pi-amex"
    {...props}
  >
    <title id="pi-amex">American Express</title>
    <g fill="none">
      <path
        fill="#0077A6"
        d="M35,22.132C35,23.168,34.168,24,33.132,24H4.868C3.832,24,3,23.168,3,22.132V1.868C3,0.832,3.832,0,4.868,0H33.13C34.168,0,35,0.83,35,1.868V22.132Z"
      />
      <path
        fill="#FFFFFF"
        d="M14.07,11.832 L14.07,11.832 L15.428,11.232 L15.428,11.232 L14.07,10.632 L14.07,10.632 L12.712,11.232 L12.712,11.232 L14.07,11.832 Z M14.07,12.336 L12.01,13.136 L12.01,9.328 L14.07,10.128 L14.07,12.336 Z M17.03,11.832 L17.03,11.832 L18.388,11.232 L18.388,11.232 L17.03,10.632 L17.03,10.632 L15.672,11.232 L15.672,11.232 L17.03,11.832 Z M17.03,12.336 L15.01,13.136 L15.01,10.128 L17.03,10.928 L17.03,12.336 Z M19.99,11.832 L19.99,11.832 L21.348,11.232 L21.348,11.232 L19.99,10.632 L19.99,10.632 L18.632,11.232 L18.632,11.232 L19.99,11.832 Z M19.99,12.336 L17.97,13.136 L17.97,10.128 L19.99,10.928 L19.99,12.336 Z M22.95,11.832 L22.95,11.832 L24.308,11.232 L24.308,11.232 L22.95,10.632 L22.95,10.632 L21.592,11.232 L21.592,11.232 L22.95,11.832 Z M22.95,12.336 L20.93,13.136 L20.93,10.128 L22.95,10.928 L22.95,12.336 Z M25.868,10.128 L23.91,9.328 L23.91,13.136 L25.868,12.336 L25.868,10.128 Z"
      />
    </g>
  </svg>
);

export const Icons = {
  logo: Logo,
  visa: Visa,
  mastercard: Mastercard,
  amex: Amex,
};
