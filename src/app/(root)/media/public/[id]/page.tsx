import RenderMedia from '@/components/media/render-media'
import React from 'react'
interface paramsprops{
   id:string
}
const page =async ({params}:{params:Promise<paramsprops>}) => {
  const {id} = await params
  return (
    <div>
      <RenderMedia id={id} isPublic/>
    </div>
  )
}

export default page