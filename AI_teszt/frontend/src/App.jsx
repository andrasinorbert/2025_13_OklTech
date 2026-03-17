import { useEffect, useMemo, useState } from "react";
import { api } from "./api";

const TOKEN_KEY = "blog_token";
const USER_KEY = "blog_user";

function AuthForm({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const path = isLogin ? "/auth/login" : "/auth/register";
      const body = isLogin
        ? { email, password }
        : { name, email, password };

      const data = await api(path, { method: "POST", body });
      onAuth(data.token, data.user);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="card" onSubmit={submit}>
      <h2>{isLogin ? "Bejelentkezes" : "Regisztracio"}</h2>
      {!isLogin && (
        <input
          placeholder="Nev"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      )}
      <input
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        placeholder="Jelszo"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <p className="error">{error}</p>}
      <button type="submit">{isLogin ? "Belepes" : "Fiok letrehozas"}</button>
      <button type="button" className="secondary" onClick={() => setIsLogin((v) => !v)}>
        {isLogin ? "Nincs fiokom" : "Mar van fiokom"}
      </button>
    </form>
  );
}

function AdminNewPost({ token, onCreated }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api("/posts", {
        method: "POST",
        token,
        body: { title, content }
      });
      setTitle("");
      setContent("");
      onCreated();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="card" onSubmit={submit}>
      <h2>Uj poszt</h2>
      <input
        placeholder="Cim"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Tartalom"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={6}
        required
      />
      {error && <p className="error">{error}</p>}
      <button type="submit">Posztol</button>
    </form>
  );
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || "");
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  const isAdmin = useMemo(() => user?.role === "admin", [user]);

  const loadPosts = async () => {
    setError("");
    try {
      const data = await api("/posts", { token });
      setPosts(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [token]);

  const onAuth = (nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const toggleLike = async (postId) => {
    if (!token) return;

    try {
      const data = await api(`/posts/${postId}/like`, {
        method: "POST",
        token
      });

      setPosts((current) =>
        current.map((post) =>
          post.id === postId
            ? { ...post, like_count: data.like_count, likedByUser: data.liked }
            : post
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <header className="header card">
        <h1>Blog</h1>
        {user ? (
          <div className="row">
            <span>
              {user.name} ({user.role})
            </span>
            <button onClick={logout}>Kijelentkezes</button>
          </div>
        ) : (
          <span>A like-olashoz belepes szukseges.</span>
        )}
      </header>

      {!user && <AuthForm onAuth={onAuth} />}
      {isAdmin && <AdminNewPost token={token} onCreated={loadPosts} />}

      {error && <p className="error">{error}</p>}

      <section className="posts">
        {posts.map((post) => (
          <article className="card" key={post.id}>
            <h3>{post.title}</h3>
            <p className="meta">
              {post.author} - {new Date(post.created_at).toLocaleString("hu-HU")}
            </p>
            <p>{post.content}</p>
            <div className="row">
              <button disabled={!token} onClick={() => toggleLike(post.id)}>
                {post.likedByUser ? "Unlike" : "Like"}
              </button>
              <span>{post.like_count} like</span>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
