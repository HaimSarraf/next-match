import { Spinner } from '@nextui-org/react'
import React from 'react'

const Loading = () => {
  return (
    <div className='flex justify-center items-center vertical-center'>
        <Spinner 
        label='LOADING...'
        color='warning'
        labelColor='foreground'
        />
    </div>
  )
}

export default Loading