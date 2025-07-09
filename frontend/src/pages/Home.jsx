import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
    return (
        <div>
            <div className="card bg-base-100 w-70 shadow-sm">
                <figure>
                    <img
                        src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                        alt="Shoes" />
                </figure>
                <div className="card-body">
                    <h2 className="card-title">Card Title</h2>
                    <h2>$400</h2>
                    <div className="card-actions justify-end">
                        <button className="btn btn-primary"><Link to="/login" >
              view
            </Link></button>
                    </div>
                </div>
            </div>
            <div className="join flex justify-center bg-gray-50 drop-shadow-black">
                <button className="join-item btn">«</button>
                <button className="join-item btn">Page 22</button>
                <button className="join-item btn">»</button>
            </div>
        </div>
    )
}

export default Home
