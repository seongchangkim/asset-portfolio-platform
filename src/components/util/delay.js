import React, { useState, useEffect } from 'react';


const Delay = ({children, waitBeforeShow = 2500}) => {
    const [isShown, setIsShown] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setIsShown(true);
        }, waitBeforeShow);
    }, [waitBeforeShow]);

    return isShown ? children : null;
};

export default Delay;