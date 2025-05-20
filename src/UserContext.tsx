import React, {createContext, useContext, useState, useEffect, ReactNode} from "react";
// Мок-данные пользователя пока оставим для возможной отладки
import {user as mockUserData} from "@/data/mockData";
import { get, post, put } from "@/services/api.ts";

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
    credits: mockUserData.bonusBalance, // bonusBalance из мока ��ак credits
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
            // Заменяем прямой вызов fetch на вызов через api-сервис с логированием
            const data = await get<User>('/profile/profiles/1');
            setUser(data);
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
            // Используем put для обновления данных пользователя
            const updatedUser = await put<User>(`/profile/profiles/${user.id}`, patch);
            setUser(updatedUser);
        } catch (err) {
            console.error('Ошибка обновления пользователя:', err);
            setError(err instanceof Error ? err.message : 'Ошибка обновления пользователя');
            // Локальное обновление для имитации при ошибке API
            setUser(prevUser => prevUser ? {...prevUser, ...patch} : null);
        } finally {
            setLoading(false);
        }
    };

    const refreshUserData = async () => {
        await fetchUserData();
    };

    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
            // Используем post для входа
            const response = await post<{ token: string, user: User }>('/auth/login', { email, password });

            // Сохраняем токен в localStorage
            if (response.token) {
                localStorage.setItem('auth_token', response.token);
            }

            setUser(response.user);
            setIsAuthenticated(true);
            return true;
        } catch (err) {
            console.error('Ошибка входа:', err);
            setError(err instanceof Error ? err.message : 'Ошибка входа');

            // Для отладки в случае ошибки API
            if (process.env.NODE_ENV === 'development') {
                console.warn("Вход с мок-данными в режиме разработки");
                setUser(mockApiUser);
                setIsAuthenticated(true);
                return true;
            }

            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('auth_token');
    };

    const addCurrency = async (amount: number) => {
        if (!user) return;
        try {
            setLoading(true);
            // Используем post для операции с валютой
            const updatedUser = await post<User>(`/profile/currency/add`, {
                profile_id: user.id,
                amount
            });
            setUser(updatedUser);
        } catch (err) {
            console.error('Ошибка пополнения баланса:', err);
            setError(err instanceof Error ? err.message : 'Ошибка пополнения баланса');

            // Локальное обновление для отладки
            if (process.env.NODE_ENV === 'development') {
                setUser(prev => prev ? {...prev, currency: (prev.currency || 0) + amount} : null);
            }
        } finally {
            setLoading(false);
        }
    };

    const addCredits = async (amount: number) => {
        if (!user) return;
        try {
            setLoading(true);
            // Используем post для операции с кредитами
            const updatedUser = await post<User>(`/profile/credits/add`, {
                profile_id: user.id,
                amount
            });
            setUser(updatedUser);
        } catch (err) {
            console.error('Ошибка пополнения бонусного баланса:', err);
            setError(err instanceof Error ? err.message : 'Ошибка пополнения бонусного баланса');

            // Локальное обновление для отладки
            if (process.env.NODE_ENV === 'development') {
                setUser(prev => prev ? {...prev, credits: (prev.credits || 0) + amount} : null);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <UserContext.Provider value={{
            user,
            loading,
            error,
            updateUser,
            refreshUserData,
            isAuthenticated,
            login,
            logout,
            addCurrency,
            addCredits,
        }}>
            {children}
        </UserContext.Provider>
    );
};

export function useUser() {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("useUser must be used within UserProvider");
    return ctx;
}

