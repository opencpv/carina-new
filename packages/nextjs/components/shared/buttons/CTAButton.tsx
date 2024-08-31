interface Props {
  text: string;
  onClick: () => void;
}
const CTAButton = ({ text, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className="px-10 rounded-full text-lg font-semibold bg-secondary  text-white hover:px-12 trasition-all duration-300  py-4"
    >
      {text}
    </button>
  );
};

export default CTAButton;
