import React, { forwardRef } from 'react';

interface ComponentWindowProps {
  title: string;
  children: React.ReactNode;
}

const ComponentWindow = forwardRef<HTMLDivElement, ComponentWindowProps>(({ title, children, ...props }, ref) => {
  return (
    <div ref={ref} {...props}>
      <h3>{title}</h3>
      {children}
    </div>
  );
});

export default ComponentWindow;
