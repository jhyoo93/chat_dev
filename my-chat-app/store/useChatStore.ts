import create from 'zustand';

interface Chat {
  _id: string;
  users: Array<{ _id: string; username: string }>;
  messages: Array<{ sender: string; receiver: string; content: string; timestamp: Date }>;
}

interface ChatState {
  chats: Chat[];
  setChats: (chats: Chat[]) => void;
}

const useChatStore = create<ChatState>((set) => ({
  chats: [],
  setChats: (chats) => set({ chats }),
}));

export default useChatStore;