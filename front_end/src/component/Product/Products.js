import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import React ,{ Fragment } from "react";
import Loader from "../layout/Loader/Loader";
import ProductCard from "../Home/ProductCard";
import './Products.css';
import { clearErrors, getProduct } from "../../actions/productAction";
import { useParams } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import {useAlert} from 'react-alert';
import MetaData from "../layout/MetaData";

const categories = [
    "Laptop",
    "Footwear",
    "Tops",
    "Bottoms",
    "Attire",
    "Camera",
    "SmartPhones",
    "Watches",
];

const Products = ()=>{
    const {keyword} = useParams();
    const dispatch = useDispatch();
    const alert = useAlert();

    const [currentPage,setCurrentPage] = useState(1);
    const [price,setPrice] = useState([0,25000]);
    const [category,setCategory]= useState("");
    const [ratings,setRatings] = useState(0);

    const {products,
           loading,
           error,
           productsCount,
           resultPerPage,
           filteredProductsCount,} = useSelector(
        (state)=>state.products
        );
        

    const setCurrentPageNo = (e)=>{
        setCurrentPage(e);
    }

    const priceHandler = (event,newPrice) => {
        setPrice(newPrice);
    }

    useEffect(()=>{
        if(error){
            alert.error(error);
            dispatch(clearErrors());
        }
        dispatch(getProduct(keyword,currentPage,price,category,ratings));

    },[dispatch,keyword,currentPage,price,category,ratings,alert,error]);

    let count = filteredProductsCount;
    return (
        <Fragment>
        {loading ? (<Loader />) : 
        <Fragment>
        <MetaData title="Products --- melA"/>
        <h2 className="productsHeading">Products  </h2>
        <div className="products">
        {products && 
            products.map((product)=>(
                <ProductCard key={product._id} product={product} />
            ))}
        </div>

        <div className="filterBox">
        <div className="price">
        <Typography>Price</Typography>
                <Slider 
                    value={price}
                    onChange={priceHandler}
                    valueLabelDisplay="auto"
                    aria-labelledby="range-slider"
                    min={0}
                    max={25000}
                />
        </div>
        <div className="categories">
        <Typography>Categories</Typography>
        </div>
       
        <ul className="categoryBox">
            {categories.map((category) => (
                <li
                className="category-link"
                key={category}
                onClick={()=> setCategory(category)}
                >{category}</li>
            ))}
        </ul>
       
       


        <fieldset>
            <Typography component="legend">Ratings Above</Typography>
            <Slider 
                value={ratings}
                onChange={(e,newRating)=> {
                    setRatings(newRating);
                }}
                aria-label = "continuous-slider"
                valueLabelDisplay="auto"
                min = {0}
                max = {5}
            />
        </fieldset>
        </div>


        {resultPerPage < count && 
        <div className="paginationBox">
            <Pagination className = "pages"
                activePage = {currentPage}
                itemsCountPerPage = {resultPerPage}
                totalItemsCount = {productsCount}
                pageRangeDisplayed={2}
                onChange = {setCurrentPageNo}
                nextPageText = "Next"
                prevPageText = "Prev"
                firstPageText = "1st"
                lastPageText = "Last"
                itemClass = "page-item"
                linkClass = "page-link"
                activeClass = "pageItemActive"
                activeLinkClass = "pageLinkActive"
            />
        </div>}

        </Fragment>}
        </Fragment>
        
    );
} 

export default Products;