import React from "react";

function Dashboard() {
    return (
        <div className="flex flex-col justify-center items-center bg-gray-100" style={{ height: 'calc(100vh - 130px)' }}>
            <img
                id="logo"
                src="./vetpetso.jpg"
                className="h-48 rounded-lg mx-auto mb-8"
                alt="Logo"
            />
            <div className="text-center">
                <h2 className="text-lg font-bold text-gray-900">Welcome to Dashboard</h2>
                <h3 className="mb-2">Concept By: <a href="https://alexharkness.com/" className="text-blue-500">Narayana Joshi</a></h3>
                <h3 className="mb-2">Developed By: <a href="https://eternaltechservices.com/" className="text-blue-500">Eternal Tech Services</a></h3>
                <h3>Version: 1.0.0</h3>
            </div>
        </div>
    );
}

export default Dashboard;
