import React from "react";

interface DecorativeBlockProps {
  className?: string;
}

const DecorativeBlock: React.FC<DecorativeBlockProps> = ({
  className = "",
}) => {
  return <div className={className} role="presentation" aria-hidden="true" />;
};

export default DecorativeBlock;
