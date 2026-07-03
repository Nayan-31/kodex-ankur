import useAuth from '../hooks/useAuth'
import { useNavigate } from 'react-router'

const Register = () => {
    const { register } = useAuth()
    const navigate = useNavigate()

    const handleRegister = async (e) => {
        e.preventDefault()
        const username = e.target.username.value
        const email = e.target.email.value
        const password = e.target.password.value

        navigate("/")
        await register({ username, email, password })
    }

    return (
        <main>
            <h1>Register</h1>
            <form onSubmit={handleRegister}>
                <input type="text" name="username" placeholder="Username" required />
                <input type="email" name="email" placeholder="Email" required />
                <input type="password" name="password" placeholder="Password" required />
                <button type="submit">Register</button>
            </form>
        </main>
    )
}

export default Register
