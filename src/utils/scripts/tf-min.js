export const tfMin = (callback) => {
    const exists = document.getElementById('tf');
    if (!exists) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs/dist/tf.min.js';
        script.id = 'tf';
        document.body.appendChild(script);
        script.onload = () => {
            if (callback) {
                callback();
            }
        };        
    }
    if(exists && callback) {
        callback();
    }
};