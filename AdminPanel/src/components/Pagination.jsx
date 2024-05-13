import React from 'react'

function Pagination({ pages, current, onPageChange }) {
    return (
        <>
            {pages > 1 ?
                < div className='flex justify-end items-center mt-4' >
                    <button
                        disabled={current === 1}
                        className="bg-white border border-blue-500 hover:bg-blue-500 text-sm text-blue-500 hover:text-white font-bold px-4 h-8 rounded mx-4"
                        onClick={() => onPageChange(current - 1)}>Prev</button>
                    <p >{current} of {pages}</p>
                    <button
                        disabled={current === pages}
                        className="bg-white border border-blue-500 hover:bg-blue-500 text-sm text-blue-500 hover:text-white font-bold px-4 h-8 rounded mx-4"
                        onClick={() => onPageChange(current + 1)} > Next</button>
                </div > : null
            }
        </>
    )
}

export default Pagination