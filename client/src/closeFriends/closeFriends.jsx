import './closeFriends.css';

const CloseFriends = ({user}) => {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER; 

    return (
        <li className='sidebarFriend'>
            <img className='sidebarFriendImg' src={PF+user.profilePicture}/>
            <span className='sidebarFrindText'>{user.username}</span>
        </li>
    );
}

export default CloseFriends;
