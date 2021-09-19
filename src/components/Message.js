import { formatRelative } from 'date-fns';

const formatDate = date => {
    let formattedDate = '';
    if (date) {
        // Convert the date to words relative to the current date
        formattedDate = formatRelative(date, new Date());
        // Capitalize first letter 
        formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    }
    return formattedDate;
}

const Message = ({ createdAt = null, text = '', displayName = '', photoURL = '' }) => {

    if (!text) return null;

    return (
        <div className="singleMessage">
            {photoURL && (<div className="one"><img src={photoURL} alt="Avatar" className="userPic" width={40} height={40}/></div>)}
            {(displayName && createdAt?.seconds) && 
            (<div className="two"><span className="msgName">{displayName}</span><span className="msgTime">{formatDate(new Date(createdAt.seconds * 1000))}</span></div>)}
            <div className="three"><p>{text}</p></div>
        </div>
    )
}

export default Message
