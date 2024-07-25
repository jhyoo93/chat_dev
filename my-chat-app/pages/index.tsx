import { useEffect } from 'react';
import { getSession, signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const Home = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // 로딩 중에는 아무것도 하지 않음
    if (!session) router.push('/api/auth/signin'); // 인증되지 않은 경우 리디렉션
    else router.push('/chat'); // 인증된 경우 채팅 페이지로 리디렉션
  }, [session, status, router]);

  if (status === 'loading') {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      {!session ? (
        <>
          <h1>채팅 앱에 오신 것을 환영합니다</h1>
          <p>계속하려면 로그인하세요.</p>
          <button onClick={() => signIn()}>로그인</button>
        </>
      ) : (
        <>
          <h1>환영합니다, {session.user.name}님</h1>
          <p>채팅 페이지로 리디렉션 중...</p>
          <button onClick={() => signOut()}>로그아웃</button>
        </>
      )}
    </div>
  );
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

export default Home;
