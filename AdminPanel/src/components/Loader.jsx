import React from 'react';

const Loader = () => {
    return (
        <div className="flex items-center justify-center " style={{ height: 'calc(100vh - 250px)' }}>
            <div className="w-16 h-16 border-4 border-t-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
        </div>
    );
};

export default Loader;
