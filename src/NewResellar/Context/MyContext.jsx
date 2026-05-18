import React from 'react';
import app from "../Auth/Firebase"
const MyContext = () => {
    const [currentUser, setCurrentUser] = React.useState(null);
    const [CurrentUserLoading, setCurrentUserLoading] = React.useState(true);
    const finalData = {
        currentUser,
        setCurrentUser,
        CurrentUserLoading,
        setCurrentUserLoading,
    };


    return (
        <div>

        </div>
    );
};

export default MyContext;