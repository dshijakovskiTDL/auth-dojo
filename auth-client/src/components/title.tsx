import { AuthType } from '../utils/types';

const DemoTitle = ({ authType }: { authType: AuthType }) => {
  return (
    <h2 className="text-2xl text-center">
      <span className="underline italic">{authType}</span> based Authentication
    </h2>
  );
};

export default DemoTitle;
