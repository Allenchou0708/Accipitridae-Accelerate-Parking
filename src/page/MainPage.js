import React from "react"
import { useState,useEffect } from "react"
import { Button,Form,Dropdown,DropdownButton } from "react-bootstrap"
import { useNavigate } from "react-router"
import 'bootstrap/dist/css/bootstrap.min.css'
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "../style/MainPage.css"
import $ from 'jquery';
import path_detail from "../refference/PathDetail"
import haversine from 'haversine-distance'
import { type } from "@testing-library/user-event/dist/type"




let MainPage = () => {

    const navigate = useNavigate()

    let [address,reviseAddress] = useState("台中市北區育才街2號")

    let [keep_address_list,reviseKeep] = useState([])

    let [token,reviseToken] = useState({"test":555})

    let [test_state,reviseTest] = useState()

    let [now_location,reviseLocation] = useState([0,0])

    let [search_range,reviseRange] = useState(500)

    let [search_type,reviseType] = useState("car") // car, moto

    let [show_detail,reviseDetail] = useState({
        "show_bool" : [],
        "search_path" : [],
        "search_result" : []
    })

    let [zoom_level,reviseLevel] = useState(16)

    let getKeepAddressList = () => {
        let db_list = ["台中市北區育才街2號","台中市西區自由路一段95號"]
        reviseKeep(db_list)
    } 

    let GetAuthorizationHeader = () => {    
        const parameter = {
            grant_type:"client_credentials",
            client_id: "sssun-09d597db-5ec8-446e",
            client_secret: "8ffe4bd6-dc2e-40e1-8f9e-2c5d62e13ab1"
        };
        
        let auth_url = "https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token";
            
        $.ajax({
            type: "POST",
            url: auth_url,
            headers: {
                    "Accept-Encoding": "br,gzip",
                  },  
            crossDomain:true,
            dataType:'JSON',                
            data: parameter,
            async: false,       
            success: function(data){ 
                let new_token = JSON.parse(JSON.stringify(data))
                reviseToken(new_token)
                return data
                // GetCoordinate(data)                         
            },
            error: function (xhr, textStatus, thrownError) {
                alert("Sorry, you are running out of the search time today")
            }
        });          
    }

    let GetCoordinate = (accesstoken,address) => {  
        console.log("in Get Coordinate")
        if(accesstoken !==undefined){
            $.ajax({
                type: 'GET',
                url: 'https://tdx.transportdata.tw/api/advanced/V3/Map/GeoCode/Coordinate/Address/' + address + '?format=JSON',             
                headers: {
                    "authorization": "Bearer " + accesstoken.access_token,
                     "Accept-Encoding": "br,gzip",
                  },            
                async: false,
                success: function (Data) {
                    // $('#apireponse').text(JSON.stringify(Data));  
                    let new_Data = JSON.parse(JSON.stringify(Data))    
                    let new_location = new_Data[0].Geometry.replace("POINT (","").replace(")","").split(" ")
                    let number_location = new_location.map((content)=>{
                        return parseFloat(content)
                    })
                    reviseLocation(number_location)   
                    return number_location
                },
                error: function (xhr, textStatus, thrownError) {
                    alert("We can't find the place of this address")
                }
            });
        }
    }

    let GetSearchPath = () => {
        console.log("in Get Search Path = ",now_location)
        let lat = now_location[0]
        let lon = now_location[1]
        let max_distence = 500
        let search_path = path_detail.filter((path,index)=>{
    
            const a = { latitude: lat, longitude: lon }
            const b = { latitude: path.ParkingSegmentPosition.PositionLon, longitude: path.ParkingSegmentPosition.PositionLat }
    
            let distence = haversine(a, b) //(in meters)
            
    
            return distence < max_distence
    
        })
    
        return search_path
    }

    let Search_Parking_Lot = (search_path) => {    

        if(token !==undefined){
            let search_result = []
            search_path.forEach(
                (path,index)=>{

                    let path_id = path.ParkingSegmentID

                
                    $.ajax({
                        type: 'GET',
                        // url: 'https://tdx.transportdata.tw/api/basic/v1/Parking/OnStreet/ParkingSegmentAvailability/City/Taichung?%24filter=ParkingSegmentID%20eq%20%270434704%27&%24top=30&%24format=JSON',
                        url: 'https://tdx.transportdata.tw/api/basic/v1/Parking/OnStreet/ParkingSegmentAvailability/City/Taichung?%24filter=ParkingSegmentID%20eq%20%27'+path_id+'%27&%24top=30&%24format=JSON',             
                        headers: {
                            "authorization": "Bearer " + token.access_token,
                                "Accept-Encoding": "br,gzip",
                            },            
                        async: false,
                        success: function (Data) {
                            // $('#apireponse').text(JSON.stringify(Data));  
                            // console.log("Data")              
                            // console.log(Data);
                            search_result.push(Data)
                        },
                        error: function (xhr, textStatus, thrownError) {
                            // console.log('errorStatus:',textStatus);
                            console.log('Error:',thrownError);
                        }
                    });

                    
                }
            )

            let show_bool = []
            search_result.forEach((result,index)=>{

                // if(index<10){
                //     console.log(result)
                // }

                if(result.CurbParkingSegmentAvailabilities.length !== 0){
                    if(result.CurbParkingSegmentAvailabilities[0].Availabilities.length!==0){
                        show_bool.push(true)
                    }else{
                        show_bool.push(false )
                    }
                }else{
                    show_bool.push(false )
                }
            })

            console.log(show_bool)
            console.log(search_path)
            console.log(search_result)

            let show_detail = {
                "show_bool" : show_bool,
                "search_path" : search_path,
                "search_result" : search_result
            }

            reviseDetail(show_detail)

            return show_detail
            
        }

    }

    let Draw_now_location = () => {

    }

    let Draw_parking_lot = () => {

    }

    let ClickSearch = async () => {
        if(address !== ""){
            let new_coordinate = await GetCoordinate(token,address)
            console.log("in clicksearch = ",new_coordinate)
            let search_path = GetSearchPath()
            Search_Parking_Lot(search_path)
        }else{
            alert("You should enter the address")
        }
    }

    

    let debug = () => {
        console.log(token)
    }

    useEffect(
        ()=>{
            // GetAuthorizationHeader()
            getKeepAddressList()
        }
        ,[]
    )


    // let 

    return <div className={["container","mt-5"].join(" ")}>
        <div className={["d-flex","justify-content-between"].join(" ")}>
            <h1>Accipitridae</h1>
            <Button variant="primary" onClick={()=>{navigate("/login")}}>帳戶登入</Button>{' '}
        </div>
        <div className={["mt-5","d-flex","justify-content-between"].join(" ")}>
            <div className={["d-flex"].join(" ")}>
                <div className={["w-50"].join(" ")}>
                    <Form.Control type="text" placeholder="請輸入查找車位的地址" value={address} onChange={(e)=>{
                        reviseAddress(e.target.value)
                    }} />
                </div>
                <Button variant="success" onClick={()=>{ClickSearch()}}>搜尋</Button>
            </div>
            
            
  
            <div className={["d-flex","justify-content-between"].join(" ")}>
                
                <Button variant="success">儲存地點</Button>
                <DropdownButton title={"常用地點"}>
                    {
                        keep_address_list.map((address,index)=>{
                            return(
                                <Dropdown.Item key={index} eventKey={index.toString()}>{address}</Dropdown.Item>
                            )
                        })
                    }
                </DropdownButton>
            </div>

        </div>
        <div className={["mt-5"].join(" ")}>
            <MapContainer center={[24.14916970984777, 120.6869877700639]} zoom={zoom_level} scrollWheelZoom={false}>
                <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {
                    now_location[0] !== 0 && now_location[1] !== 0 ? 
                        <Marker position={[now_location[0],now_location[1]]}>
                        </Marker> : <span></span>

                }
                {
                    show_detail.show_bool.map((bool,index)=>{
                        if(bool === true){
                            let position = show_detail.search_path[index].ParkingSegmentPosition
                            let space_array = show_detail.search_result[index].CurbParkingSegmentAvailabilities[0].Availabilities
                            let streetName = show_detail.search_result[index].CurbParkingSegmentAvailabilities[0].ParkingSegmentName.Zh_tw
                            let available_space = 0 
                            space_array.forEach(
                                (space_info,index)=>{
                                    available_space+=space_info.AvailableSpaces
                                }
                            )
                            // if(search_type === "car"){
                            //     let specific_space = space_array.filter((space_info,index)=>{
                            //         if(space_info.SpaceType === 1){
                            //             return true
                            //         }else{
                            //             return false
                            //         } 
                            //     })

                            //     specific_space[0]
                            // }else{

                            // }

                            return <Marker position={[position.PositionLat,position.PositionLon]}>
                                <Popup>
                                    {streetName} <br /> 剩餘車位 : {available_space} <br /> <button>Dieraction</button>
                                </Popup>
                            </Marker>
                        }
                        
                    })
                }


            </MapContainer>
        </div>
        <div>
            <Button variant="warning" onClick={()=>{alert(address)}}>Debug</Button>
            <Button variant="warning" onClick={()=>{debug()}}>try api</Button>
            <Button variant="warning" onClick={()=>{reviseLocation([24.14916970984777, 120.6869877700639])}}>change location</Button>
            <Button variant="warning" onClick={()=>{reviseLocation([24.14916970984777, 120.6869877700639])}}>change location 2</Button>
            <Button variant="warning" onClick={()=>{console.log(now_location)}}>look location</Button>
            <Button variant="warning" onClick={()=>{GetAuthorizationHeader()}}>GetAuthorizationHeader()</Button>
            <Button variant="warning" onClick={()=>{Search_Parking_Lot(["aaa","bbb","ccc"])}}>Search_Parking_Lot</Button>
        </div>
    </div>
}
export {MainPage as default}

// Frontend Revise
// Type of car
// now_location_marker color

// Dieraction
// change Range
// Touching

// Incorporate All
// Video
// PPT

// Intern PPT
// Read Paper
// Vision PPT
// Documentation