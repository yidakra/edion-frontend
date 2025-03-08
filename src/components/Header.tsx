
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ChatHistoryMenu from './ChatHistory';
import { UserSettings as UserSettingsType, ChatHistoryItem } from '../types';
import { useToast } from "@/hooks/use-toast";

const getUserSettingsFromStorage = (): UserSettingsType => {
  const storedSettings = localStorage.getItem('userSettings');
  if (storedSettings) {
    return JSON.parse(storedSettings);
  }
  return {
    username: 'teacher_jane',
    fullName: 'Jane Smith',
    email: 'jane.smith@school.edu',
    profilePicture: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
    darkMode: false,
  };
};

const getChatHistoryFromStorage = (): ChatHistoryItem[] => {
  const storedHistory = localStorage.getItem('chatHistory');
  if (storedHistory) {
    return JSON.parse(storedHistory);
  }
  return [];
};

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [showHistory, setShowHistory] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>(getChatHistoryFromStorage());
  
  const [userSettings, setUserSettings] = useState<UserSettingsType>(getUserSettingsFromStorage());

  useEffect(() => {
    if (userSettings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [userSettings.darkMode]);

  useEffect(() => {
    const handleStorageChange = () => {
      setChatHistory(getChatHistoryFromStorage());
      setUserSettings(getUserSettingsFromStorage());
    };

    window.addEventListener('storage', handleStorageChange);
    
    setChatHistory(getChatHistoryFromStorage());
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [location.pathname]);

  const handleHistoryAction = (chatId: string) => {
    if (chatId !== '') {
      console.log(`Selected chat with ID: ${chatId}`);
      navigate('/chat', { state: { selectedChatId: chatId } });
    }
  };

  const handleDeleteChat = (chatId: string) => {
    const updatedHistory = chatHistory.filter(chat => chat.id !== chatId);
    setChatHistory(updatedHistory);
    localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
    
    const storedTabs = localStorage.getItem('chatTabs');
    if (storedTabs) {
      const tabs = JSON.parse(storedTabs);
      const updatedTabs = tabs.filter((tab: any) => tab.id !== chatId);
      localStorage.setItem('chatTabs', JSON.stringify(updatedTabs));
    }

    window.dispatchEvent(new CustomEvent('chatDeleted', { detail: { chatId } }));
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  const goToSettings = () => {
    navigate('/settings');
  };

  return (
    <>
      <motion.header 
        className="w-full flex justify-between items-center p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.button 
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors duration-200 z-20"
          onClick={toggleHistory}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <LayoutGrid className="w-5 h-5" />
        </motion.button>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Avatar 
            className="h-10 w-10 cursor-pointer"
            onClick={goToSettings}
          >
            <AvatarImage src={userSettings.profilePicture} alt="User" />
            <AvatarFallback>{userSettings.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
        </motion.div>
      </motion.header>

      {showHistory && (
        <ChatHistoryMenu 
          history={chatHistory} 
          onSelectChat={handleHistoryAction}
          onDeleteChat={handleDeleteChat}
        />
      )}
    </>
  );
};

export default Header;
