import { Link } from 'react-router';
import { authTypes } from '../utils/types';

const Footer = () => {
  return (
    <footer className="border-t border-t-slate-500/20">
      <div className="container mx-auto py-5 w-full grid grid-cols-3 gap-4">
        <Link to="/" className="font-semibold place-self-start text-lg">
          Auth 🥷 Dojo
        </Link>

        <p className="place-self-center">
          Powered by{' '}
          <a
            href="https://www.linkedin.com/in/daniel-shijakovski-ba78001ba/"
            target="_blank"
            className="font-bold"
          >
            MyCuriosity&copy;
          </a>
        </p>

        <ul className="flex place-self-end items-center gap-4">
          {authTypes.map((aType) => (
            <li key={aType}>
              <Link
                to={aType.toLowerCase()}
                className="text-blue-700 underline font-medium hover:text-blue-900 focus-visible:text-blue-900"
              >
                {aType}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
