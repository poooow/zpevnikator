interface BtnArrowBackProps {
  width?: string;
  height?: string;
}

const BtnArrowBack = (props: BtnArrowBackProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    baseProfile="basic"
    viewBox="0 0 150 150"
    {...props}
  >
    <path d="m42 75 61.5-61.5 4.5 4.6L51.1 75l56.9 56.9-4.5 4.6z" />
  </svg>
);

export default BtnArrowBack;
