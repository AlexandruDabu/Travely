import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";
import App from "../layout/App";
import RequireAuth from "./RequireAuth";
import HomePage from "../../features/Home/Login";
import NotFound from "../../features/Error/NotFound";
import Travels from "../../features/Travels/Travels";
import Login from "../../features/Home/Login";
import TravelDetails from "../../features/Travels/TravelDetails";
import MyTravels from "../../features/Profile/MyTravels/MyTravels";
import SideBar from "../../features/Profile/SideBar";
import EditTravel from "../../features/Profile/MyTravels/EditTravel";
import CreateTravel from "../../features/Travels/CreateTravel";
import UsersProfile from "../../features/Users/UsersProfile";
import UserProfile from "../../features/Profile/UserProfile";
import Follow from "../../features/Profile/Follow/Follow";
import DiscoverPeople from "../../features/Discover/DiscoverPeople";
import FAQ from "../../features/FAQ/FAQ";
import SessionExpired from "../../features/Error/SessionExpired";
import Layout from "../../features/Home/UsersSideBar";

export const routes: RouteObject[] = [
    {
        path: '/',
        element:<App/>,
        children: [
            {element: <RequireAuth/>, children: [
                {path:'travels/:id', element: <TravelDetails/>},
                {path: 'profiles', element: <SideBar/>, children: [
                {path: '', element : <Layout/> ,children : [
                    {path:':email', element: <UserProfile/>},
                    {path:'travels', element: <MyTravels/>},
                    {path:':id/edit', element: <EditTravel/>},
                    {path:'travels/create', element: <CreateTravel/>},
                    {path:`followers`, element: <Follow/>},
                    {path:`followings`, element: <Follow/>},
                ]}]},
                {path: '/', element : <Layout/> ,children : [
                    {path:'travels', element: <Travels/>},
                    {path:`faq`, element: <FAQ/>},
                    {path:`travels/search`, element: <Travels/>},
                    {path:`discoverPeople`, element: <DiscoverPeople/>},
                ]},
                {path:`users/:id`, element: <UsersProfile/>},
                
            ]},
            {path: 'session-expired', element: <SessionExpired/>},
            {path: '/login', element: <Login/>},
            {path: 'notFound', element: <NotFound/>},
            {path: '*',element: <Navigate replace to='/notFound'/>}
        ]
    }
]

export const router = createBrowserRouter(routes);