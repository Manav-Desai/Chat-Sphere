import './App.css'
import ChatPage from './component/ChatPage.jsx'
import HomePage from './component/HomePage.jsx'
import Error from "./component/Error.jsx"
import { createBrowserRouter, RouterProvider } from "react-router-dom"

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <Error />
  },
  {
    path: "/chats",
    element: <ChatPage />,
    errorElement: <Error />
  }
]);

function App() {

  return (
    <div className='App'>
      <RouterProvider router={appRouter}/>
    </div>
  )
}

export default App
