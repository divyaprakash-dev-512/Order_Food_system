import './App.css'
import { Routes, Route } from 'react-router-dom'

import AdminLayout from './Admin/AdminLayout'
import AdminLogin from './Admin/AdminLogin'
import Dashboard from './Admin/Dashboard'
import Reguser from './Admin/Reguser'
import FoodCategory from './Admin/FoodCategory'
import FoodMenu from './Admin/FoodMenu'
import LandingPage from './Pages/LandingPage'
import CreateFood from './Admin/CreateFood'
import EditFood from './Admin/EditFood'
import EditUser from './Admin/EditUser'
import EditCategory from './Admin/EditCategory'
import CategoryFoods from './Pages/CategoryFoods'
import Account from './Pages/Account'
import Singlefood from './Pages/Singlefood'
import MyCart from './Pages/MyCart'
import OrdersAdmin from './Admin/Orders'

import Orders from './Admin/Orders'
import Profile from './Admin/Profile'
import ChangePassword from './Admin/ChangePassword'

function App() {
  return (
    <>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path='/' element={<LandingPage />} />
        <Route path='/myCart' element={<MyCart />} />
        <Route path='/food-menu/category/:category' element={<CategoryFoods />} />
        <Route path='/food-menu/item/:id' element={<Singlefood />} />
        <Route path='/admin-login' element={<AdminLogin />} />

        {/* ✅ ACCOUNT (NESTED ROUTES) */}
        <Route path='/account' element={<Account />}>
          <Route path='orders' element={<Orders />} />
          <Route path='profile' element={<Profile />} />
          <Route path='change-password' element={<ChangePassword />} />
        </Route>

        {/* ADMIN ROUTES */}
        <Route element={<AdminLayout />}>
          <Route path='/admin' element={<Dashboard />} />
          <Route path='/dash' element={<Dashboard />} />
          <Route path='/create-food' element={<CreateFood />} />
          <Route path='/food-menu/edit/:id' element={<EditFood />} />
          <Route path='/reg-users/edit/:id' element={<EditUser />} />
          <Route path='/food-category/edit/:categoryId' element={<EditCategory />} />
          <Route path='/reg-users' element={<Reguser />} />
          <Route path='/food-category' element={<FoodCategory />} />
          <Route path='/food-menu' element={<FoodMenu />} />
          <Route path='/orders' element={<OrdersAdmin />} />
        </Route>

      </Routes>
    </>
  )
}

export default App
