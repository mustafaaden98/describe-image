import './App.css'
import Header from './components/Header'
import { ImageUpload } from './components/ImageUpload'
import Footer from './components/Footer'

function App() {

  return (
    <div style={{backgroundColor: '#E8F0FE'}}>
        <Header />
        <div className="body-container">
        <ImageUpload/>
        <Footer/>
        </div>
    </div>)
}
export default App
