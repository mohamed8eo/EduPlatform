import React from 'react'

const page = async ({params}: {params: Promise<{category: string}>}) => {
    const {category} = await params

  return (
    <div className='min-h-screen flex flex-col items-center justify-center'>
        <h1 className='text-4xl font-bold'>{category}</h1>
    </div>
  )
}

export default page