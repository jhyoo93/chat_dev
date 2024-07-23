import create from 'zustand';

// 채팅 상태 인터페이스 정의
interface ChatState {
  messages: Array<{ sender: string, receiver: string, content: string, timestamp: Date }>; // 메시지 배열
  addMessage: (message: { sender: string, receiver: string, content: string, timestamp: Date }) => void; // 메시지 추가 함수
  setMessages: (messages: Array<{ sender: string, receiver: string, content: string, timestamp: Date }>) => void; // 메시지 설정 함수
}

// Zustand를 사용하여 상태 저장소 생성
const useStore = create<ChatState>((set) => ({
  messages: [],
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setMessages: (messages) => set({ messages })
}));

export default useStore;