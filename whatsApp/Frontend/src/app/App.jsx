import { useEffect } from 'react'
import { Provider } from "react-redux"
import { store } from "./app.store"
import { RouterProvider } from "react-router"
import router from "./app.routes"
import useAuth from "../features/auth/hooks/useAuth"




function Main() {
  const { handleGetCurrentUser } = useAuth()

  useEffect(() => {
    handleGetCurrentUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  return <RouterProvider router={router} />

}

function App() {
  return (
    <>
      <Provider store={store}>
        <Main />
      </Provider>
    </>
  )
}

export default App
