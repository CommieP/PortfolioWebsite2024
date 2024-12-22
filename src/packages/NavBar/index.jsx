import { useNavigate } from 'react-router-dom';
import './navBar.css';
import { useSelector, useDispatch } from 'react-redux';
import NavBarData from '../Data/NavBarData';
import { setCurrentPage } from '../store/reducers/currentPageReducer';

const NavBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentPage = useSelector((state) => state.currentPageData.currentPage);
  console.log(currentPage)

  const handleNavBarButtonClick = (index) => {
    console.log(index);
    dispatch(setCurrentPage(index)); // Update the current page in Redux store
    navigate(NavBarData[index].route); // Navigate to the respective route
  };

  return (
    <div className="navBar">
      <div className="navBar-header">
        <div>Portfolio 2024 </div>
      </div>
      <div className="navBar-tabs">
        {NavBarData.map((item, index) => (
          <button
            key={index}
            className={`navBar-tab ${currentPage === index ? 'active' : ''}`}
            onClick={() => handleNavBarButtonClick(index)}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NavBar;
