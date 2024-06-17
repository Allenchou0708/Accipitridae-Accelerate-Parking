import React from "react"
import { useState,useEffect } from "react"
import { Button,Form,Dropdown,DropdownButton, InputGroup } from "react-bootstrap"
import { useNavigate, useOutletContext } from "react-router"
import 'bootstrap/dist/css/bootstrap.min.css'
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "../style/MainPage.css"
import $ from 'jquery';
import path_detail from "../refference/PathDetail"
import haversine from 'haversine-distance'
import { type } from "@testing-library/user-event/dist/type"
import { icon } from "leaflet"

import { firestore } from "../firebase";
import { doc, addDoc, collection, getDocs, serverTimestamp, deleteDoc, query, where } from "@firebase/firestore";


let MainPage = () => {

    const navigate = useNavigate()

    let [address,reviseAddress] = useState("")

    let [keep_address_list,reviseKeep] = useState([])

    let [token,reviseToken] = useState({"test":555})

    let [test_state,reviseTest] = useState()

    let [now_location,reviseLocation] = useState([24.14916970984777, 120.6869877700639])
    let [now_lat, reviseLat] = useState(0)
    let [now_lon, reviseLon] = useState(0)

    let [search_range,reviseRange] = useState(400)

    let [search_type,reviseType] = useState("car") // car, moto

    let [show_detail,reviseDetail] = useState({
        "show_bool" : [],
        "search_path" : [],
        "search_result" : []
    })

    let {common_user,reviseCommonUser} = useOutletContext()

    let [zoom_level,reviseLevel] = useState(16)

    const [s_address, setAddress] = useState("");
    const [addresses, setAddresses] = useState([]);
    const [searchAddress, setSearchAddress] = useState("");
    const [searchResult, setSearchResult] = useState("");

    const addAddress = async (e) => {
        e.preventDefault();
        try {
            const docRef = await addDoc(collection(firestore, "addresses"), {
                name: s_address,
                timestamp: serverTimestamp(),
                test_list: [1,23,456]
            });
            console.log("Document written with ID: ", docRef.id);
            fetchAddress(); // 更新地址清單
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    const deleteAddress = async (id) => {
        try {
            await deleteDoc(doc(firestore, "addresses", id));
            console.log("Document with ID: ", id, " successfully deleted");
            fetchAddress(); // 更新地址清單
        } catch (e) {
            console.error("Error deleting document: ", e);
        }
    }

    const searchAddressFunc = async () => {
        try {
            const q = query(collection(firestore, "addresses"), where("name", "==", searchAddress));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                console.log("No matching documents.");
                setSearchResult("找不到該地址");
            } else {
                querySnapshot.forEach((doc) => {
                    setSearchResult(doc.data().name);
                });
            }
        } catch (e) {
            console.error("Error searching for document: ", e);
        }
    }

    const searchAddressBool = async () => {
        try {
            const q = query(collection(firestore, "addresses"), where("name", "==", common_user));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                return false
            } else {
                return true
            }
        } catch (e) {
            console.error("Error searching for document: ", e);
            return false
        }
    }

    const fetchAddress = async () => {
        try {
            const querySnapshot = await getDocs(collection(firestore, "addresses"));
            const newData = querySnapshot.docs.map((doc) => {
                console.log(doc.data().test_list)
                return { id: doc.id, name: doc.data().name }
            });
            setAddresses(newData);
        } catch (e) {
            console.error("Error fetching documents: ", e);
        }
    }




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
                    console.log("in GetCoordinate : ")
                    console.log(number_location)
                    reviseLocation(number_location)  
                    console.log(number_location)
                    reviseLat(number_location[0]) 
                    reviseLon(number_location[1]) 
                    console.log(now_lat)
                    console.log(now_lon)
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
        let search_path = path_detail.filter((path,index)=>{
    
            const a = { latitude: lat, longitude: lon }
            const b = { latitude: path.ParkingSegmentPosition.PositionLon, longitude: path.ParkingSegmentPosition.PositionLat }
    
            let distence = haversine(a, b) //(in meters)
            
    
            return distence < search_range
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

    let choose_range = (changed_id) => {
        switch(changed_id){
            case 1:
                reviseRange(200)
                break
            case 2:
                reviseRange(400)
                break
            case 3:
                reviseRange(800)
                break
            default:
                reviseRange(500)
        }
    }

    let ClickSearch = () => {
        if(address !== ""){
            GetCoordinate(token,address)
            console.log("in clicksearch = ", now_location)
            console.log("in clicksearch = ", now_lat)
            console.log("in clicksearch = ", now_lon)
            let search_path = GetSearchPath()
            Search_Parking_Lot(search_path)
        }else{
            alert("You should enter the address")
        }
    }

    let ClickStore = () => {
        if(common_user === ""){
            alert("You should login first")
        }else{
            if(address !== ""){
                let a = 123
            }else{
                alert("You should enter the address")
            }
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
        <div className={["d-flex","justify-content-between","align-items-center","mb-5","pb-4","mp_zigzag_line"].join(" ")}>
            <div className={["d-flex"].join(" ")}>
                <h1 className={["font-effect-shadow-multiple","mp_title_word"].join(" ")}>Accipitridae</h1>
                <img className={["mp_title_img","ms-4"].join(" ")} src="./eagle.jpg"></img>
            </div>
            
            {
                common_user === "" ? 
                <span className={["mp_white_button","px-5","py-3","mx-1","my-1","mt-3"].join(" ")} onClick={()=>{navigate("/login")}}>帳戶登入</span>
                : <span onClick={()=>{navigate("/login")}}>Hi, {common_user}</span>

            }
    
        
        </div>
        <div className="mt-5"> </div>
        <div className={["mt-5","d-flex","justify-content-between","align-items-center"].join(" ")}>
            <div className={["d-flex","mp_left_control_wrap","align-items-center"].join(" ")}>
                <div className={["w-75","mp_control_height"].join(" ")}>
                    <InputGroup className="mb-3">
                        <Form.Control type="text" placeholder="請輸入查找車位的地址" value={address} onChange={(e)=>{
                            reviseAddress(e.target.value)
                        }} />

                        <DropdownButton className="mp_dark_blue_button" title={"常用地點"}>
                    {
                        keep_address_list.map((address,index)=>{
                            return(
                                <Dropdown.Item key={index} eventKey={index.toString()} onClick={()=>{reviseAddress(address)}}>{address}</Dropdown.Item>
                            )
                        })
                    }
                </DropdownButton>
                    </InputGroup>
                </div>
                {
                    address === ""?
                    <Button className={["ms-4","mp_control_height","px-3","disable"]} variant="secondary" onClick={()=>{ClickSearch()}}>搜尋</Button>
                    :<Button className={["ms-4","mp_control_height","px-3"]} variant="success" onClick={()=>{ClickSearch()}}>搜尋</Button>
                }
                
            </div>
            
            
  
            <div className={["d-flex","justify-content-between","align-items-center"].join(" ")}>
                {
                    common_user === ""?
                    <Button variant="secondary" className={["me-4","mp_control_height","mp_control_line_height","px-3","disable"].join(" ")} onClick={()=>{ClickStore()}}>儲存地點</Button>
                    :
                    address === "" ?
                    <Button variant="secondary" className={["me-4","mp_control_height","mp_control_line_height","px-3","disable"].join(" ")} onClick={()=>{ClickStore()}}>儲存地點</Button>
                    : <Button variant="warning" className={["me-4","mp_control_height","mp_control_line_height","px-3","mp_save_button"].join(" ")} onClick={()=>{ClickStore()}}>儲存地點</Button>

                }
                
                {/*<span class={["material-symbols-outlined","mp_star_height"].join(" ")}>star</span>*/}
                <DropdownButton id="dropdown-basic-button" className={["mp_control_height"].join(" ")} title={"搜尋半徑 : "+search_range+" m  "}>
                    <Dropdown.Item href="#/action-1" onClick={ () => {choose_range(1)}}>200 m</Dropdown.Item>
                    <Dropdown.Item href="#/action-2" onClick={ () => {choose_range(2)}}>400 m</Dropdown.Item>
                    <Dropdown.Item href="#/action-3" onClick={ () => {choose_range(3)}}>800 m</Dropdown.Item>
                </DropdownButton>
                
                
                
            </div>

        </div>
        <div className={["mt-5"].join(" ")}>
            <MapContainer center={now_location} zoom={zoom_level} scrollWheelZoom={false}>
                <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {
                    // now_location[0] !== 0 && now_location[1] !== 0 ? 
                        <Marker position={[now_location[0],now_location[1]] } >
                        </Marker>

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

                            return <Marker position={[position.PositionLat,position.PositionLon]} opacity={0.7}>
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
            <Button variant="warning" onClick={()=>{reviseLocation([24.13589470057062, 120.6773753686955])}}>change location 2</Button>
            <Button variant="warning" onClick={()=>{console.log(now_location)}}>look location</Button>
            <Button variant="warning" onClick={()=>{GetAuthorizationHeader()}}>GetAuthorizationHeader()</Button>
            <Button variant="warning" onClick={()=>{Search_Parking_Lot(["aaa","bbb","ccc"])}}>Search_Parking_Lot</Button>
            <Button variant="warning" onClick={()=>{console.log(common_user)}}>Check pages</Button>
        </div>
        <div>
                <div>
                    <input
                        type="text"
                        placeholder="地址"
                        value={s_address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    <button onClick={addAddress}>新增</button>
                </div>

                <div>
                    <input
                        type="text"
                        placeholder="查詢地址"
                        value={searchAddress}
                        onChange={(e) => setSearchAddress(e.target.value)}
                    />
                    <button onClick={searchAddressFunc}>查詢</button>
                    {searchResult && <p>{searchResult}</p>}
                </div>

                <div>
                    <h2>地址清單</h2>
                    <ul>
                        {addresses.map(item => (
                            <li key={item.id}>
                                {item.name}
                                <button onClick={() => deleteAddress(item.id)}>刪除</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
    </div>
}
export {MainPage as default}

// Frontend Revise
// Type of car

// Dieraction
// Touching

// Video
// PPT

// Read Paper
// Vision PPT
// Documentation