import { Link } from 'react-router';

const Footer = () => {
  return (
    <footer className="border-t border-t-slate-500/20">
      <div className="container mx-auto py-5 w-full flex items-center justify-between gap-4">
        <Link to="/" className="font-semibold  text-lg">
          Auth 🥷 Dojo
        </Link>

        <p>
          Powered by{' '}
          <a
            href="https://www.linkedin.com/in/daniel-shijakovski-ba78001ba/"
            target="_blank"
            className="font-bold"
          >
            MyCuriosity&copy;
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
