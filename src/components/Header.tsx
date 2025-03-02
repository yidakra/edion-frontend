
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ChatHistoryMenu from './ChatHistory';
import UserSettingsModal from './UserSettings';
import { UserSettings as UserSettingsType, ChatHistoryItem, ChatTab, ChatMessage } from '../types';

const Header = () => {
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Dummy user settings for demonstration
  const [userSettings, setUserSettings] = useState<UserSettingsType>({
    username: 'teacher_jane',
    fullName: 'Jane Smith',
    email: 'jane.smith@school.edu',
    profilePicture: 'https://github.com/shadcn.png',
    darkMode: false,
  });

  // Chat tab management
  const [tabs, setTabs] = useState<ChatTab[]>([
    {
      id: '1',
      title: 'Drafting a report for Justin',
      date: '24/06/2024',
      messages: [
        {
          id: 1,
          text: 'Hey Edion, can you generate a report for one of my students?',
          isUser: true,
        },
        {
          id: 2,
          text: 'Of course. Please provide any necessary documents, notes or work from said student.\n\nFurthermore, attach a draft or reference for how you would want the report to be structured, or select one which you have previously completed.',
          isUser: false,
        },
      ],
      activePDF: null,
    },
  ]);
  const [activeTabId, setActiveTabId] = useState(tabs[0].id);

  // Apply dark mode based on user settings
  useEffect(() => {
    if (userSettings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [userSettings.darkMode]);

  // Dummy chat history data
  const chatHistory = [
    {
      id: '1',
      title: 'Generate 3 Student Reports',
      date: '11/02/2024',
      lastMessage: 'The reports have been generated successfully.',
    },
    {
      id: '2',
      title: 'Civil War Quiz',
      date: '10/02/2024',
      lastMessage: 'Quiz has been created and saved.',
    },
  ];

  const handleHistoryAction = (chatId: string) => {
    if (chatId === '') {
      setShowHistory(false);
    } else {
      // Select the chat and close history menu
      setShowHistory(false);
      console.log(`Selected chat with ID: ${chatId}`);
      
      // If the tab already exists, switch to it
      const existingTab = tabs.find(tab => tab.id === chatId);
      if (existingTab) {
        setActiveTabId(chatId);
      } else {
        // Find the chat in history
        const selectedChat = chatHistory.find(chat => chat.id === chatId);
        if (selectedChat) {
          // Create a new tab based on selected chat
          const newTab: ChatTab = {
            id: selectedChat.id,
            title: selectedChat.title,
            date: selectedChat.date,
            messages: [{
              id: 1,
              text: selectedChat.lastMessage,
              isUser: false,
            }],
            activePDF: null,
          };
          setTabs([...tabs, newTab]);
          setActiveTabId(newTab.id);
        }
      }
    }
  };

  const handleSaveSettings = (newSettings: UserSettingsType) => {
    setUserSettings(newSettings);
  };

  return (
    <>
      <motion.header 
        className="w-full flex justify-between items-center p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <button 
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors duration-200"
          onClick={() => setShowHistory(!showHistory)}
        >
          <LayoutGrid className="w-5 h-5" />
        </button>
        
        <Avatar 
          className="h-10 w-10 transition-transform duration-200 hover:scale-105 cursor-pointer"
          onClick={() => setShowSettings(true)}
        >
          <AvatarImage src="https://github.com/shadcn.png" alt="User" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      </motion.header>

      {/* Side Menu */}
      {showHistory && <ChatHistoryMenu history={chatHistory} onSelectChat={handleHistoryAction} />}

      {/* Settings Modal */}
      {showSettings && (
        <UserSettingsModal
          settings={userSettings}
          onClose={() => setShowSettings(false)}
          onSave={handleSaveSettings}
        />
      )}
    </>
  );
};

export default Header;
