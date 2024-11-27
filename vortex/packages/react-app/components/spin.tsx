//put the spin component here
import React from "react"

const Spin =()=>{
    return(
        <div className="w-full min-h-screen flex justify-center items-center">
             <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
            <h1  className="text-7xl text-green-800">SPINER</h1>
        </div>

        </div>
       )
}

export default Spin;