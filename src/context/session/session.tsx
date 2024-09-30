'use client'

import { toast } from 'react-hot-toast';
import { useRouter } from "next/navigation";
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type UserData = {
    id: string | null,
    emp_id: string | null;
    emp_name: string | null;
    emp_surname: string | null;
    role: string | null;
};

export const UserSessionContext = createContext<{
    user: UserData;
    login: (data: UserData) => void;
    logout: () => void;
} | undefined>(undefined);

export const SessionProvider: React.FunctionComponent<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserData>(() => {

        if (typeof window !== 'undefined') {
            const storedData = sessionStorage.getItem(`trainLog`);

            return storedData ? JSON.parse(storedData) : { emp_id: null, serverIndex: 1, id: null, accessLevel: null }
        }
    });

    const router = useRouter();

    useEffect(() => {
        if (user?.id === null || user?.emp_id === null) {
            router.push('/')
        }
    }, [user, router]);

    const login = async (data: UserData) => {
        if (!data) {
            toast(`Login Failed`,
                {
                    icon: '❌',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                }
            );

            router.push("/");

            return;
        }

        setUser(data);

        toast(`Welcome ${data?.emp_name}`,
            {
                icon: '👋',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            }
        );

        const path = data?.role === 'Admin' ? '/' : '/'

        router.push(path);
    };

    useEffect(() => { sessionStorage.setItem(`trainLog`, JSON.stringify(user)) }, [user]);

    const logout = () => {
        sessionStorage.removeItem(`trainLog`);

        //router.push("/login");

        toast(`Signed Out!`,
            {
                icon: '👋',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            }
        );
    };

    return <UserSessionContext.Provider value={{ user, login, logout }}>{children}</UserSessionContext.Provider>;
};

export const useSession = () => {
    const context = useContext(UserSessionContext);

    if (context === undefined) {
        throw new Error('useSession must be used within a UserSessionProvider');
    }

    return context;
};
