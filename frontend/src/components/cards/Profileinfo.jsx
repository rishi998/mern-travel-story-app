import React from 'react'
import { getinitials } from '../../utils/helper'
const Profileinfo = ({userinfo, onlogout}) => {

  return (
    userinfo && (
    <div className='flex items-center gap-3'>
      <div className='w-12 h-12 flex items-center rounded-full text-slate-950 font-medium bg-slate-100 pl-5'>
        {getinitials(userinfo? userinfo.fullname:"")}
      </div>
      <p className='text-sm font-medium'>{userinfo.fullname}</p>
      <button className='text-sm text-slate-700 underline' onClick={onlogout}>
        Logout
      </button>
    </div>
    )
  )
}

export default Profileinfo
