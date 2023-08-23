import React from 'react';
import Topbar from '../../components/topbar/Topbar';
import Feed from '../../components/feed/Feed'
import SideBar from '../../components/sideBar/SideBar';
import RightBar from '../../components/rightBar/RightBar'
import './home.css'
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';

const Home = () => {
    const {user} = useContext(AuthContext);

    return (
        <>
            <Topbar />
            <div className='homeContainer'>
                <SideBar />
                <Feed />
                <RightBar />
            </div>
            
        </>
    );
}

export default Home;
