import { useNavigate } from 'react-router-dom';
import './navBar.css'
const NavBar = () =>{

    const naviagte = useNavigate();

    const handleAbout = () =>{
        naviagte("/about")
    }
    const handleProjects = () =>{
        naviagte("/projects")
    }
    const handleExplorations = () =>{
        naviagte("/explorations")
    }
    return(
        <div className='navBar'>
            <div className=''>
                <div>
                    2024 Portfolio
                </div>
            </div>
            <div>
                <div onClick={handleAbout}>
                    ABOUT
                </div>
                <div onClick={handleProjects}>
                    PROJECTS
                </div>
                <div onClick={handleExplorations}>
                    EXPLORATIONS
                </div>
            </div>
        </div>
    )
    
}

export default NavBar;