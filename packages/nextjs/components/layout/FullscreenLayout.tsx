import { Toaster } from "react-hot-toast";

interface Props {
  children: React.ReactNode;
  className?: string;
}
const FullscreenLayout = ({ children, className }: Props) => {
  return (
    <section className={`w-full h-[100vh] ${className}`}>
      <Toaster />
      {children}
    </section>
  );
};

export default FullscreenLayout;
