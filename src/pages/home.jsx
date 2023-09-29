import React, { useEffect, useState } from 'react'
import FilterList from '../components/filter-list'
import ProductCard from '../components/product-card'
import Navigation from '../components/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { CSSTransition } from 'react-transition-group'
import Client from '../api/client'
import API_ENDPOINTS from '../api/api-endpoints'
import { setCategories, setProducts } from '../store/reducers'
import { useLocation } from 'react-router-dom'
import ProductCardKkeleton from '../components/skeleton/product-card-skeleton'

export default function HomePage({ tele }) {

    const dispatch = useDispatch()
    const products = useSelector(state => state.products)
    const [showPage, setShowPage] = useState(false);
    const query = useLocation()

    async function getCategories() {
        const resp = await Client.get(API_ENDPOINTS.CATEGORIES)
        if (resp.status === 200) {
            dispatch(setCategories(resp.data.results))
        }
    }

    async function getProducts() {
        const resp = await Client.get(API_ENDPOINTS.PRODUCT_LIST)
        if (resp.status === 200) {
            dispatch(setProducts(resp.data.results))
        }
    }

    async function getMe(chat_id) {
        const resp = await Client.get(API_ENDPOINTS.AUTH_CHECK)
        console.log(resp);
    }

    useEffect(() => {
        getCategories()
        getProducts()
        setShowPage(true)
        if (query.search !== '') {
            console.log(query.search.split('?')[1]);
            getMe(query.search.split('?')[1])
        }
    }, [])

    return (
        <CSSTransition
            in={showPage}
            timeout={300}
            classNames="page"
            unmountOnExit
            >
            <div className="main">
            <FilterList />
                <div className='products'>
                    {
                        products?.length > 0 ?
                            products.map(el => {
                                return <ProductCard el={el} key={el.id} />
                            }) : <ProductCardKkeleton />
                    }
                </div >
                <div className="navigate-cart">
                    <Navigation tele={tele} route={'/cart'} />
                </div>
            </div >
        </CSSTransition>

    )
}
