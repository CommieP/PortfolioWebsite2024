import React, { forwardRef } from 'react';
import './page.css';

const PageSection = forwardRef(({ children }, ref) => (
    <div className="pageSection" ref={ref}>
        {children}
    </div>
));

export default PageSection;
