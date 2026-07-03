import useAuth from '../hooks/useAuth'
import { useNavigate } from 'react-router'

const Login = () => {

    const { login } = useAuth()

    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        const email = e.target.email.value
        const password = e.target.password.value
        await login({ email, password })
        navigate("/")
    }

    return (
        <main>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input type="email" name="email" placeholder="Email" required />
                <input type="password" name="password" placeholder="Password" required />
                <button type="submit">Login</button>
            </form>
        </main>
    )
}

export default Login