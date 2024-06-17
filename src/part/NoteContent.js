import React from "react"
import { useState } from "react"
import { Outlet } from "react-router"

const NoteContent = () => {
    let [common_user,reviseCommonUser] = useState("")
    return <Outlet context={{common_user,reviseCommonUser}}></Outlet>
}

export {NoteContent as default}