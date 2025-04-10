import { createContext, useContext, useState} from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const stored  = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    });

    const login = (data) => {
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);