import React from 'react'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const StatusCarousel = () => {
    const responsive = {
        superLargeDesktop: {
            // the naming can be any, depends on you.
            breakpoint: { max: 4000, min: 3000 },
            items: 20
        },
        desktop: {
            breakpoint: { max: 3000, min: 1400 },
            items: 9
        },
        tablet: {
            breakpoint: { max: 1400, min: 1200 },
            items: 6
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 4
        }
    };
    return (

        <Carousel className='mt-2 bg-black text-white' responsive={responsive}>
            <div className='w-[80px] h-[90px]  overflow-hidden'>
                <div className=' w-[70px] h-[70px] rounded-full absolute inset-0 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 p-[2px]'>
                    <img className='rounded-full w-full h-full object-cover' src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Profile" />
                </div>
                <h6 className='absolute bottom-0 ml-2'>Ronaldo</h6>
            </div>
            <div className='w-[80px] h-[90px]  overflow-hidden'>
                <div className=' w-[70px] h-[70px] rounded-full absolute inset-0 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 p-[2px]'>
                    <img className='rounded-full w-full h-full object-cover' src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Profile" />
                </div>
                <h6 className='absolute bottom-0 ml-2'>Ronaldo</h6>
            </div>
            <div className='w-[80px] h-[90px]  overflow-hidden'>
                <div className=' w-[70px] h-[70px] rounded-full absolute inset-0 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 p-[2px]'>
                    <img className='rounded-full w-full h-full object-cover' src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Profile" />
                </div>
                <h6 className='absolute bottom-0 ml-2'>Ronaldo</h6>
            </div>
            <div className='w-[80px] h-[90px]  overflow-hidden'>
                <div className=' w-[70px] h-[70px] rounded-full absolute inset-0 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 p-[2px]'>
                    <img className='rounded-full w-full h-full object-cover' src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Profile" />
                </div>
                <h6 className='absolute bottom-0 ml-2'>Ronaldo</h6>
            </div>
            <div className='w-[80px] h-[90px]  overflow-hidden'>
                <div className=' w-[70px] h-[70px] rounded-full absolute inset-0 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 p-[2px]'>
                    <img className='rounded-full w-full h-full object-cover' src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Profile" />
                </div>
                <h6 className='absolute bottom-0 ml-2'>Ronaldo</h6>
            </div>
            <div className='w-[80px] h-[90px]  overflow-hidden'>
                <div className=' w-[70px] h-[70px] rounded-full absolute inset-0 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 p-[2px]'>
                    <img className='rounded-full w-full h-full object-cover' src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Profile" />
                </div>
                <h6 className='absolute bottom-0 ml-2'>Ronaldo</h6>
            </div>
            <div className='w-[80px] h-[90px]  overflow-hidden'>
                <div className=' w-[70px] h-[70px] rounded-full absolute inset-0 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 p-[2px]'>
                    <img className='rounded-full w-full h-full object-cover' src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Profile" />
                </div>
                <h6 className='absolute bottom-0 ml-2'>Ronaldo</h6>
            </div>
            <div className='w-[80px] h-[90px]  overflow-hidden'>
                <div className=' w-[70px] h-[70px] rounded-full absolute inset-0 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 p-[2px]'>
                    <img className='rounded-full w-full h-full object-cover' src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Profile" />
                </div>
                <h6 className='absolute bottom-0 ml-2'>Ronaldo</h6>
            </div>
            <div className='w-[80px] h-[90px]  overflow-hidden'>
                <div className=' w-[70px] h-[70px] rounded-full absolute inset-0 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 p-[2px]'>
                    <img className='rounded-full w-full h-full object-cover' src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Profile" />
                </div>
                <h6 className='absolute bottom-0 ml-2'>Ronaldo</h6>
            </div>
            <div className='w-[80px] h-[90px]  overflow-hidden'>
                <div className=' w-[70px] h-[70px] rounded-full absolute inset-0 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 p-[2px]'>
                    <img className='rounded-full w-full h-full object-cover' src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Profile" />
                </div>
                <h6 className='absolute bottom-0 ml-2'>Ronaldo</h6>
            </div>
            <div className='w-[80px] h-[90px]  overflow-hidden'>
                <div className=' w-[70px] h-[70px] rounded-full absolute inset-0 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 p-[2px]'>
                    <img className='rounded-full w-full h-full object-cover' src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Profile" />
                </div>
                <h6 className='absolute bottom-0 ml-2'>Ronaldo</h6>
            </div>
            <div className='w-[80px] h-[90px]  overflow-hidden'>
                <div className=' w-[70px] h-[70px] rounded-full absolute inset-0 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 p-[2px]'>
                    <img className='rounded-full w-full h-full object-cover' src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Profile" />
                </div>
                <h6 className='absolute bottom-0 ml-2'>Ronaldo</h6>
            </div>
           
        </Carousel>

    );
}

export default StatusCarousel