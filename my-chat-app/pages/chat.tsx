import { getSession } from 'next-auth/react';
import Chat from '../components/Chat';

const ChatPage = () => {
  return <Chat />;
};

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default ChatPage;
