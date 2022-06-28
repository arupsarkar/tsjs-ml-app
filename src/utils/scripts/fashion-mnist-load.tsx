export const fashionMNIST = (callback: () => any) => {
    const exists = document.getElementById('fashion-mnist');
    if(!exists) {
        const script = document.createElement('script')
        script.src = 'https://storage.googleapis.com/jmstore/TensorFlowJS/EdX/TrainingData/fashion-mnist.js'
        script.id = 'fashion-mnist'
        document.body.appendChild(script)
        script.onload = () => {
            if(callback) {
                callback()
            }
        }
    }
    if(exists && callback) {
        callback()
    }
}