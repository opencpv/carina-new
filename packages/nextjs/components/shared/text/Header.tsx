interface Props {
  text: string;
}
const Header = ({ text }: Props) => {
  return (
    <h1 className="font-black text-5xl text-primary text-center">
      {text.split("\n").map((line, index) => (
        <span key={index} className="block text-center">
          {line}
        </span>
      ))}
    </h1>
  );
};

export default Header;
