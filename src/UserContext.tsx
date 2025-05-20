import React, {createContext, useContext, useState, useEffect, ReactNode} from "react";
// Мок-данные пользователя пока оставим для возможной отладки
import {user as mockUserData} from "@/data/mockData";
import {max} from "date-fns";

// Обновленный интерфейс для пользователя на основе данных API
export interface User {
    id: number;
    name: string;
    currency: number;
    credits: number;
    battlepass_lvl: number;
    vip: boolean;
}

// Адаптированный мок-пользователь под новую структуру User
const mockApiUser: User = {
    id: mockUserData.id,
    name: mockUserData.username, // Используем username из мока как name
    currency: mockUserData.balance, // balance из мока как currency
    credits: mockUserData.bonusBalance, // bonusBalance из мока как credits
    battlepass_lvl: mockUserData.battlePassLevel, // battlePassLevel из мока как battlepass_lvl
    vip: mockUserData.vipLevel ? mockUserData.vipLevel >= 1 : false, // Преобразуем vipLevel в boolean
};


type UserContextType = {
    user: User | null;
    loading: boolean;
    error: string | null;
    updateUser: (patch: Partial<User>) => Promise<void>;
    refreshUserData: () => Promise<void>;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    addCurrency: (amount: number) => Promise<void>; // Переименовано с addBalance
    addCredits: (amount: number) => Promise<void>;  // Переименовано с addBonusBalance
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({children}: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const fetchUserData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://5.129.199.72:9090/profile/profiles/1', {
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` // Раскомментировать при необходимости
                }
            });
            if (!response.ok) {
                const errorData = await response.text();
                console.error("API Error Response:", response.status, errorData);
                throw new Error(`Ошибка загрузки профиля: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            setUser(data as User);
            setIsAuthenticated(true);
        } catch (err) {
            console.error('Ошибка при загрузке данных пользователя:', err);
            setError(err instanceof Error ? err.message : 'Неизвестная ошибка при загрузке данных пользователя');
            // В случае ошибки можно загрузить мок-данные для разработки
            console.warn("Загрузка мок-данных пользователя из-за ошибки API.");
            setUser(mockApiUser);
            setIsAuthenticated(true); // Для разработки
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchUserData();
    }, []);

    const updateUser = async (patch: Partial<User>) => {
        if (!user) return;
        setLoading(true);
        try {
            // TODO: Реализовать API запрос для обновления данных пользователя (`PATCH /profile/profiles/{user.id}`)
            // Локальное обновление для имитации
            setUser(prevUser => prevUser ? {...prevUser, ...patch} : null);
            // После успешного обновления на сервере, можно вызвать refreshUserData() или обновить локально, если API возвращает обновленного юзера
        } catch (err) {
            console.error('Ошибка обновления пользователя:', err);
            setError(err instanceof Error ? err.message : 'Ошибка обновления пользователя');
        } finally {
            setLoading(false);
        }
    };

    const refreshUserData = async () => {
        await fetchUserData();
    };

    const login = async (email: string, password: string): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            // TODO: Реализовать API запрос для логина
            localStorage.setItem('auth_token', 'demo_api_token_v3_login');
            await fetchUserData();
            return true; // fetchUserData установит isAuthenticated, если успешно
        } catch (err) {
            console.error('Ошибка авторизации:', err);
            setError(err instanceof Error ? err.message : 'Ошибка авторизации');
            localStorage.removeItem('auth_token');
            setIsAuthenticated(false);
            setUser(null);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        setUser(null);
        setIsAuthenticated(false);
        // TODO: Реализовать API запрос для логаута на сервере (если требуется)
    };

    // Переименованная функция для пополнения currency
    const addCurrency = async (amount: number) => {
        if (!user) {
            setError("Пользователь не аутентифицирован для пополнения валюты.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://5.129.199.72:9090/profile/profiles/topup', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "profile_id": user.id,
                    "currency": amount
                })
            });

            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch (e) {
                    errorData = await response.text();
                }
                console.error("Ошибка API при пополнении валюты:", response.status, errorData);
                throw new Error((typeof errorData === 'object' && errorData?.detail) || `Ошибка при пополнении валюты: ${response.status}`);
            }
            await refreshUserData();
        } catch (err) {
            console.error('Ошибка при пополнении валюты:', err);
            setError(err instanceof Error ? err.message : 'Неизвестная ошибка при пополнении валюты.');
        } finally {
            setLoading(false);
        }
    };

    // Переименованная функция для пополнения credits
    const addCredits = async (amount: number) => {
        if (!user) {
            setError("Пользователь не аутентифицирован для пополнения кредитов.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://5.129.199.72:9090/profile/profiles/topup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: JSON.stringify({
                    profile_id: user.id,
                    currency: 0,
                    credits: amount
                })
            });

            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch (e) {
                    errorData = await response.text();
                }
                console.error("Ошибка API при пополнении кредитов:", response.status, errorData);
                throw new Error((typeof errorData === 'object' && errorData?.detail) || `Ошибка при пополнении кредитов: ${response.status}`);
            }
            await refreshUserData();
        } catch (err) {
            console.error('Ошибка при пополнении кредитов:', err);
            setError(err instanceof Error ? err.message : 'Неизвестная ошибка при пополнении кредитов.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <UserContext.Provider
            value={{
                user,
                loading,
                error,
                updateUser,
                refreshUserData,
                isAuthenticated,
                login,
                logout,
                addCurrency, // Передаем addCurrency
                addCredits   // Передаем addCredits
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export function useUser() {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("useUser must be used within UserProvider");
    return ctx;
}

