import {BrowserRouter as Router , Route, Routes} from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from './pages/Signup'
import CreatePost from './pages/CreatePost'
import Notification from "./pages/Notification"
import Inbox from "./pages/Inbox"
import Chat from "./pages/Chat"
import User from "./pages/User"
import SinglePost from "./pages/SinglePost"
import ProtectedRoute from "./Components/ProtectedRoute"
function App() {
 
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={ <ProtectedRoute element={<Home/>}/> }/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/createpost" element={<ProtectedRoute element={<CreatePost/>}/> }/>
        <Route path="/notification" element={<Notification/>}/>
        <Route path="/inbox" element={<Inbox/>}/>
        <Route path="/direct/:id" element={<Chat/>}/>
        <Route path="/user/:id" element={<User/>}/>
        <Route path='/p/:postid' element={<SinglePost/>}/>
      </Routes>
    </Router>
    </>
    
  )
}

export default App
