import { Coffee } from 'lucide-react';

const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center">
        <Coffee className="h-12 w-12 text-primary-600 animate-spin" />
        <p className="mt-4 text-secondary-600 font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;