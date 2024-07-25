import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/router';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [error, setError] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      router.push('/chat'); // 로그인 성공 시 채팅 페이지로 리디렉션
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5' }}>
      <form onSubmit={handleSubmit} style={{ padding: '2rem', borderRadius: '0.5rem', backgroundColor: '#fff', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
        <h1 style={{ textAlign: 'center' }}>랜덤 Talk</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div style={{ margin: '1rem 0' }}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ margin: '1rem 0' }}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #ccc' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #ccc' }}>
         로그인
        </button>
      </form>
    </div>
  );
};

export default SignIn;
