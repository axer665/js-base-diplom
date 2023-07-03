/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest;
    xhr.responseType = 'json'; // формат, в котором необходимо выдать результат

    xhr.onload = () => {
        if (xhr.readyState === xhr.DONE) {
            options.callback(null, xhr.response);
        }
    }

    xhr.onerror = () => {
        alert("Не удалось получить данные от сервера");
    }

    try {
        formData = new FormData;
        if (options.method != "GET" && options.data && Object.keys(options.data).length > 0) {
            xhr.open( options.method, options.url );
            Object.entries(options.data).forEach(([key, value]) => {
                formData.append( key, value );
            })
            xhr.send( formData );
        } else {
            let params = "";
            let paramNum = 0;

            if (options.data && Object.keys(options.data).length > 0) {
                Object.entries(options.data).forEach(([key, value]) => {
                    if (paramNum === 0) {
                        params += "?";
                    }
                    params += key + "=" + value;
                    paramNum++;
                    if (paramNum != Object.keys(options.data).length) {
                        params += "&";
                    }
                })
            } 
            xhr.open( options.method, options.url + params );
            xhr.send();
        }
        
        
    }
    catch ( e ) {
        options.callback( e, null );
    }
};
