import {useRef, useEffect} from 'react'

const Canvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    useEffect(() => {
        const canvas = canvasRef.current
        if(!canvas) {
            console.log('---> canvas component null', 'returning')
            return
        }else{
            console.log('---> canvas component not null')
        }
        const context = canvas.getContext('2d')
        if(!context) {
            console.log('---> canvas context null', 'returning')
            return
        }else {
            console.log('---> canvas context not null')
        }
        console.log('---> drawing canvas - start')
        context.fillStyle = 'blue'
        context.fillRect(200,200, 100, 100)
        console.log('---> drawing canvas - end')
    }, [])
    return (
        <canvas ref={canvasRef}/>
    )
}


export default Canvas