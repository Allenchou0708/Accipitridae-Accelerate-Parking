import React from "react"
import { useState } from "react"
import { Button,Form,Dropdown,DropdownButton } from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css'

let MainPage = () => {

    // let [] = useState()

    return <div className={["container","mt-5"].join(" ")}>
        <div className={["d-flex","justify-content-between"].join(" ")}>
            <h1>Accipitridae</h1>
            <Button variant="primary">帳戶登入</Button>{' '}
        </div>
        <div className={["mt-5","d-flex","justify-content-between"].join(" ")}>
            <div className={["d-flex"].join(" ")}>
                <div className={["w-50"].join(" ")}>
                    <Form.Control type="text" placeholder="請輸入查找車位的地址" />
                </div>
                <Button variant="success">搜尋</Button>
            </div>
            
            
  
            <div className={["d-flex","justify-content-between"].join(" ")}>
                
                <Button variant="success">導航</Button>
                <DropdownButton title={"常用地點"}>
                    <Dropdown.Item eventKey="1">Action</Dropdown.Item>
                    <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
                    <Dropdown.Item eventKey="3" active>Active Item</Dropdown.Item>
                </DropdownButton>
            </div>

        </div>
        <div className={["mt-5"].join(" ")}>
            <h1>Map Here</h1>
        </div>
    </div>
}
export {MainPage as default}