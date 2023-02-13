import React, {useState, useEffect} from 'react';
import { Auth, Hub } from 'aws-amplify';


const AuthContext = React.createContext();

const AuthProvider = ({children}) => {

    const [ user, setUser ] = useState(undefined);

    const checkUser = async() => {
        try {
            const authUser = await Auth.currentAuthenticatedUser({bypassCache: true})
            setUser(authUser);
        } catch (e) {
            setUser(0);
        }
    };

    useEffect(() => {
        setTimeout(() =>{
            checkUser();
        }, 2000)
    },[]);
    useEffect(() => {
        // Listener -> check Hub events
        const listener = (data) => {
            if (data.payload.event == "signIn" || data.payload.event == "signOut") {
                checkUser();
            }
        }
        Hub.listen("auth", listener);
        return () => Hub.remove("auth", listener);
        
    },[]);

    return (
        <AuthContext.Provider value={{user}}>
            {children}
        </AuthContext.Provider>
    )
};

export { AuthContext, AuthProvider};